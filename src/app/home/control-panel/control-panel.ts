import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button';
import { ObservationsService } from '../../../services/observations';
import { observationSubmissionSignal } from '../../../services/signal'
import { observationBodyDTO, observationFormDTO, observationSubmissionDTO } from './dtos/control-panel.dto';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-control-panel',
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.scss',
})

export class ControlPanel {

  private ObservationsService = inject(ObservationsService);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  fields;
  form;

  constructor() {
    this.fields = this.ObservationsService.observation_fields
    let controls: any = {}
    for (let field of this.fields) {
      controls[field.title] = [field.defaultValue, field.validators]
    }
    this.form = this.fb.group(controls)
  }

  // running = false;

  async run() {
    const observation: observationSubmissionDTO = 
      {...this.form.getRawValue() as unknown as observationFormDTO, status: "Pending"};

    const user = this.auth.user();

    const reqBody: observationBodyDTO = {
      "observation": {
        "observation_name": String(this.form.value["name"]),
        "center_frequency": Number(this.form.value["cFreq"]),
        "rf_gain": Number(this.form.value["rfGain"]),
        "if_gain": Number(this.form.value["ifGain"]),
        "bb_gain": Number(this.form.value["bbGain"]),
        "dec": Number(this.form.value["dec"]),
        "ra": Number(this.form.value["ra"]),
        "bins": Number(this.form.value["bins"]),
        "channels": Number(this.form.value["channels"]),
        "bandwidth": String(this.form.value["bandwidth"]),
        "integration_time": Number(this.form.value["duration"]),
        "observation_type": String(this.form.value["obsType"]),
        "output_filename": "Observation_" + formatDate(Date.now(), "yyyy-MM-dd-HH-mm-ss", "en-US"),
        "receive_csv": this.form.value["csvBool"] === "Yes",
      },
      "requestor":{
        "email": user?.email || "",
        "username": user?.user_metadata["username"] || "",
        "user_id": user?.id || ""
      },
    }
    this.ObservationsService.addSubmission(observation);

    try{
      const res = await fetch(import.meta.env['NG_APP_API_URL'], { /* ... */ })
      
      if(!res.ok){
        // 2. Update status on failure
        this.ObservationsService.updateSubmissionStatus(observation, "Failed");
        throw new Error(`Response Status: ${res.status}`)
      } else {
        // 2. Update status on success (if needed, or maybe the backend returns final status)
        // If the backend returns 'Finished', update it here
         this.ObservationsService.updateSubmissionStatus(observation, "Finished"); 
         // Or keep as pending if waiting for something else
      }
    } catch(e){
       this.ObservationsService.updateSubmissionStatus(observation, "Failed");
       console.error(e)
    }
  }

}
