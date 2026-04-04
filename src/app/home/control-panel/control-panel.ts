import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { CloseScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { ObservationsService } from '../../../services/observations';
import { observationSubmissionSignal } from '../../../services/signal'
import { observationBodyDTO, observationFormDTO, observationSubmissionDTO, privilegedObservationBodyDTO, privilegedObservationFormDTO } from './dtos/control-panel.dto';
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
    MatSnackBarModule
  ],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.scss',
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.noop(),
      deps: [Overlay],
    },
  ],
})

export class ControlPanel {

  private ObservationsService = inject(ObservationsService);
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);
  private snackBar = inject(MatSnackBar)

  public privilegedFieldNames = [
    "rfGain", "ifGain", "bbGain", "ra", "dec"
  ]
  public visibleFields: any[] = [];

  public fields;
  public form;

  constructor() {
    this.fields = this.ObservationsService.observation_fields
    let controls: any = {}
    for (let field of this.fields) {
      controls[field.title] = [field.defaultValue, field.validators]
    }
    this.form = this.fb.group(controls)
  }

  async run() {

    const user = this.auth.user();
    const session = this.auth.session();

    let observationData: any = {
        "observation_name": String(this.form.value["name"]),
        "center_frequency": Number(this.form.value["cFreq"]),
        "bins": Number(this.form.value["bins"]),
        "channels": Number(this.form.value["channels"]),
        "bandwidth": String(this.form.value["bandwidth"]),
        "integration_time": Number(this.form.value["duration"]),
        "observation_type": String(this.form.value["observationType"]),
        "output_filename": "Observation_" + formatDate(Date.now(), "yyyy-MM-dd-HH-mm-ss", "en-US"),
        "receive_csv": this.form.value["csvBool"] === "Yes",
        "preferred_email": String(this.form.value["prefEmail"])
      }
    
    let requestor = null
    if(user){
      requestor = {
        "email": user?.email || "",
        "username": user?.user_metadata["username"] || "",
        "user_id": user?.id || ""
      }
    }

    if(await this.auth.isPrivileged()){
      observationData = { ...observationData,
        "rf_gain": Number(this.form.value["rfGain"]),
        "if_gain": Number(this.form.value["ifGain"]),
        "bb_gain": Number(this.form.value["bbGain"]),
        "dec": Number(this.form.value["dec"]),
        "ra": Number(this.form.value["ra"]),
      }
    }

    const reqBody: observationBodyDTO | privilegedObservationBodyDTO = {
      "observation": observationData,
      "requestor": requestor,
    }
    this.ObservationsService.addSubmission(
      {...reqBody.observation, 
        ...reqBody.requestor, 
        "status": "Pending", "message": ""
      }
    );

    let id;
    if(user){
      const {data, error} = await this.auth.supabase.from('observations')
      .insert([{...reqBody.observation, ...reqBody.requestor}]) //remember to create corresponding_table
      .select() //return uuid
      if(error){
        console.error(error)
      }
      id = (data as any)[0].id
    }

    try{
      const res = await fetch(import.meta.env['NG_APP_API_URL'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify(reqBody),
      });
      
      if(user){ //with user
        if(!res.ok){ //not okay res
          // Update status on failure
          this.ObservationsService.updateSubmissionStatus({...reqBody.observation, ...reqBody.requestor, status: "Pending", message: ""}, "Failed");
          await this.auth.supabase
          .from('observations')
          .update({status: "Failed", message: `${res.status}`})
          .eq('id', id)
          throw new Error(`Response Status: ${res.status}`)
        } else { //ok res with user
          // Update status on success (if needed, or maybe the backend returns final status)
          // If the backend returns 'Finished', update it here
          this.ObservationsService.updateSubmissionStatus({...reqBody.observation, ...reqBody.requestor, status: "Pending", message: ""}, "Finished"); 
          await this.auth.supabase
          .from('observations')
          .update({status: "Finished"})
          .eq('id', id)
        }
      } else { // no user
        if(!res.ok){ //not okay res
          this.snackBar.open(`Request Failed: ${res.status}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        } else { //okay res
          this.snackBar.open('Observation Submitted Successfully.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        }
      }
    } catch(e){ // error handling
      if(user){ //with user
        this.ObservationsService.updateSubmissionStatus({...reqBody.observation, ...reqBody.requestor, status: "Pending", message: ""}, "Failed");
        await this.auth.supabase
        .from('observations')
        .update({status: "Failed"})
        .eq('id', id)
        console.error(e)
      } else { //without
        this.snackBar.open(`Error Submitting Request.`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
      }
    }
  }

  public async canShowField(fieldTitle: any){
    if (this.privilegedFieldNames.includes(fieldTitle)) {
      return await this.auth.isPrivileged()
    }
    return true;
  }

  async ngOnInit(){
    while (!this.auth.sessionLoaded()) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.visibleFields = [];
    for (const field of this.fields) {
      if (await this.canShowField(field.title)) {
        this.visibleFields.push(field.title);
      }
    }

    this.privilegedFieldNames.forEach(async field => {
    const control = this.form.get(field);
    if (!control) return;

    if (await this.auth.isPrivileged()) {
      control.setValidators([Validators.required]);
    }
    control.updateValueAndValidity();
  });

  }
}
