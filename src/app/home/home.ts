import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, Form } from '@angular/forms';
import { ControlPanel } from "./control-panel/control-panel";
import { ObservationHistory } from "./observation-history/observation-history";

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ControlPanel,
    ObservationHistory
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home {
  fields = [
    {
      title: 'test1',
      alias: 'Center Frequency (Hz)',
      type: 'text',
      defaultValue: '1.45e9',
      validators: [Validators.required]
    },
    {
      title: 'test2',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: '20',
      validators: []
    },
    {
      title: 'test3',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: '10',
      validators: [Validators.required]
    },
  ]

  private fb = inject(FormBuilder);
  form;
  running = false

  constructor() {
    let controls: any = {}
    for (let field of this.fields) {
      controls[field.title] = [field.defaultValue, field.validators]
    }
    this.form = this.fb.group(controls)
  }


  run() {
    this.running = true
    console.log(this.form.value)
  }

  cancel() {
    this.running = false
  }
}
