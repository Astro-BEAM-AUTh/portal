import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

//! NOT INCLUDING: Observation object, observation type, need input for those
export class ObservationsService {

  observation_fields = [
    {
      title: 'name',
      alias: 'Observation Name',
      type: 'text',
      placeholder: 'Enter name here...',
      validators: [Validators.required]
    },
    {
      title: 'cFreq',
      alias: 'Center Frequency (Hz)',
      type: 'text',
      defaultValue: '1.45e9',
      validators: [Validators.required]
    },
    {
      title: 'bandwith',
      alias: 'Bandwith',
      type: 'select',
      defaultValue: '2.4MHz',
      values: ["500kHz", "1MHz", "2MHz", "2.4MHz", "3.2MHz"],
      validators: [Validators.required]
    },
    {
      title: 'channels',
      alias: 'Number of Channels',
      type: 'select',
      defaultValue: 2048,
      values: [256, 512, 1024, 2048],
      validators: [Validators.required]
    },
    {
      title: 'bins',
      alias: 'Number of Bins',
      type: 'text',
      defaultValue: 500,
      validators: [Validators.required]
    },
    {
      title: 'rfGain',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: '20',
      validators: [Validators.required]
    },
    {
      title: 'ifGain',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: '10',
      validators: [Validators.required]
    },
    {
      title: 'duration',
      alias: 'Duration (in seconds)',
      type: 'text',
      defaultValue: 60,
      placeholder: 'Enter the duration of the observation here...',
      validators: [Validators.required]
    },
    {
      title: 'csvBool',
      alias: 'Receive Raw Data as CSV?',
      type: 'select',
      defaultValue: "No",
      values: ["Yes", "No"],
      validators: [Validators.required]
    },

  ]

}
