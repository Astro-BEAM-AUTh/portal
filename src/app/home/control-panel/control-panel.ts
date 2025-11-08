import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CancelObservation } from './cancel-observation/cancel-observation';
import { ObservationsService } from '../../../services/observations';

@Component({
  selector: 'app-control-panel',
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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

  running = false;

  run() {
    this.running = true
    console.log(this.form.value)
  }

  readonly dialog = inject(MatDialog);

  openCancelDialog() {
    // this.running = false
    let dialogRef = this.dialog.open(CancelObservation, { autoFocus: false, panelClass: ['primary-button', 'custom-modalbox'] });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

  cancel() {
    this.running = false
  }

}
