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
import { Overlay } from '@angular/cdk/overlay';
import { ObservationsService } from '../../../services/observations';
import { observationBodyDTO, privilegedObservationBodyDTO } from './dtos/control-panel.dto';
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

    const centerFrequencyRaw = Number(this.form.value["cFreq"]);
    const centerFrequencyMhz = centerFrequencyRaw > 1000000 ? centerFrequencyRaw / 1000000 : centerFrequencyRaw;

    let observationData: any = {
        "target_name": String(this.form.value["name"]),
        "observation_object": String(this.form.value["name"]),
        "center_frequency": centerFrequencyMhz,
        "ra": Number(this.form.value["ra"] ?? 0),
        "dec": Number(this.form.value["dec"] ?? 0),
        "rf_gain": Number(this.form.value["rfGain"] ?? 0),
        "if_gain": Number(this.form.value["ifGain"] ?? 0),
        "bb_gain": Number(this.form.value["bbGain"] ?? 0),
        "integration_time": Number(this.form.value["duration"]),
        "observation_type": String(this.form.value["observationType"]),
        "output_filename": "Observation_" + formatDate(Date.now(), "yyyy-MM-dd-HH-mm-ss", "en-US"),
      }

    let requestor;
    if (user) {
      requestor = {
        "email": user?.email || "",
        "username": user?.user_metadata["username"] || user?.email?.split('@')[0] || "astro_user",
        "user_id": user?.id || ""
      }
    } else {
      const preferredEmail = String(this.form.value["prefEmail"] || "guest@astrobeam.gr");
      const guestId = `guest_${preferredEmail.toLowerCase()}`;
      requestor = {
        "email": preferredEmail,
        "username": preferredEmail.split('@')[0] || guestId,
        "user_id": guestId
      };
    }

    if (await this.auth.isPrivileged()) {
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
        "observation_id": "pending_local",
        "user_id": -1,
        "status": "pending",
        "submitted_at": new Date().toISOString(),
        "completed_at": null,
      }
    );

    try{
      const res = await this.ObservationsService.submitObservation(reqBody, session?.access_token);

      if (!res.ok) {
        this.ObservationsService.updateSubmissionStatus({
          ...reqBody.observation,
          observation_id: "pending_local",
          user_id: -1,
          status: "pending",
          submitted_at: new Date().toISOString(),
          completed_at: null,
        }, "failed");
        this.snackBar.open(`Request failed: ${res.status}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Submission is accepted by backend and remains pending until backend processing updates it.
      this.ObservationsService.updateSubmissionStatus({
        ...reqBody.observation,
        observation_id: "pending_local",
        user_id: -1,
        status: "pending",
        submitted_at: new Date().toISOString(),
        completed_at: null,
      }, "pending");

      this.snackBar.open('Observation submitted and accepted for processing.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
    } catch(e){ // error handling
      this.ObservationsService.updateSubmissionStatus({
        ...reqBody.observation,
        observation_id: "pending_local",
        user_id: -1,
        status: "pending",
        submitted_at: new Date().toISOString(),
        completed_at: null,
      }, "failed");
      console.error(e)
      this.snackBar.open(`Error submitting request.`, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
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
