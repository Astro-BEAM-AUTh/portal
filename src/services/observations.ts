import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {

  observation_fields = [
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

    {
      title: 'test4',
      alias: 'Center Frequency (Hz)',
      type: 'text',
      defaultValue: '1.45e9',
      validators: [Validators.required]
    },
    {
      title: 'test5',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: '20',
      validators: []
    },
    {
      title: 'test6',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: '10',
      validators: [Validators.required]
    },

    {
      title: 'test7',
      alias: 'Center Frequency (Hz)',
      type: 'text',
      defaultValue: '1.45e9',
      validators: [Validators.required]
    },
    {
      title: 'test8',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: '20',
      validators: []
    },
    {
      title: 'test9',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: '10',
      validators: [Validators.required]
    },
  ]

}
