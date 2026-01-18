import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button';
import { ObservationsService } from '../../../services/observations';
import { observationSubmissionSignal } from '../../../services/signal'

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

  run() {
    // this.running = true
    console.log(this.form.value)
    observationSubmissionSignal.set(this.form.value);
  }
  /*
  add bb gain, ra, dec, obs type, 
  observation object is assigned at runtime
  integration duration same as duration in s
  autogen output filename

  cooldown, no more than 1h between obs, maybe elevated privs

  ranges:
  observation type 1. Cold Calibration 2. Hot Calibration 3. Target Observation
  gains: 0-30
  ra: 0-359
  dec: 0-90
  duration: until 30m
  center freq: - pending - (ex: 1.42e9)
  bandwith: pending
  bins: pending
  */

}
