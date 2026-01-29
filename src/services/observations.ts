import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { observationFormDTO, observationSubmissionDTO } from '../app/home/control-panel/dtos/control-panel.dto';


@Injectable({
  providedIn: 'root',
})

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
      title: 'observationType',
      alias: 'Observation Type',
      type: 'select',
      defaultValue: 'Hot Calibration',
      values: ["Cold Calibration", "Hot Calibration", "Target Observation"],
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
      title: 'bandwidth',
      alias: 'Bandwidth',
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
      validators: [Validators.required] //pending range
    },
    {
      title: 'rfGain',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: 20,
      validators: [Validators.required, Validators.min(0), Validators.max(30)]
    },
    {
      title: 'ifGain',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: 10,
      validators: [Validators.required, Validators.min(0), Validators.max(30)]
    },
    {
      title: 'bbGain',
      alias: 'BB Gain',
      type: 'text',
      defaultValue: 10,
      validators: [Validators.required, Validators.min(0), Validators.max(30)]
    },
    {
      title: 'ra',
      alias: 'RA',
      type: 'text',
      defaultValue: 10,
      validators: [Validators.required, Validators.min(0), Validators.max(359)]
    },
    {
      title: 'dec',
      alias: 'DEC',
      type: 'text',
      defaultValue: 10,
      validators: [Validators.required, Validators.min(0), Validators.max(90)]
    },
    {
      title: 'duration',
      alias: 'Duration (in seconds)',
      type: 'text',
      defaultValue: 60,
      placeholder: 'Enter the duration of the observation here...',
      validators: [Validators.required, Validators.min(0), Validators.max(1800)]
    },
    {
      title: 'csvBool',
      alias: 'Receive Raw Data as CSV?',
      type: 'select',
      defaultValue: "No",
      values: ["Yes", "No"],
      validators: [Validators.required]
    },

  /*
  observation object is assigned at runtime
  integration duration same as duration in s
  autogen output filename

  cooldown, no more than 1h between obs, maybe elevated privs

  ranges:
  center freq: - pending - (ex: 1.42e9)
  bandwith: pending
  bins: pending
  */

  ];

  readonly history = signal<observationSubmissionDTO[]>([]);

  // ...existing code... (keep your existing fields config)

  addSubmission(submission: observationSubmissionDTO) {
    // Add to top of list
    this.history.update(list => [submission, ...list]);
  }

  updateSubmissionStatus(submission: observationSubmissionDTO, status: "Finished"| "Pending" | "Rejected" | "Failed") {
    // Update specific item completely immutably
    this.history.update(list => 
      list.map(item => item === submission ? { ...item, status } : item)
    );
  }
  
}
