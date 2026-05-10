import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { inject, signal } from '@angular/core';
import { observationBodyDTO, observationSubmissionDTO, ObservationStatusDTO } from '../app/home/control-panel/dtos/control-panel.dto';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {
  private auth = inject(AuthService);
  private loaded = false;
  private backendBaseUrl = (import.meta.env['NG_APP_BACKEND_URL'] || '').replace(/\/$/, '');
  private submitUrl = import.meta.env['NG_APP_API_URL'] || `${this.backendBaseUrl}/v1/telescope/observations`;
  private historyUrl = import.meta.env['NG_APP_OBSERVATION_HISTORY_URL'] || (this.backendBaseUrl ? `${this.backendBaseUrl}/v1/telescope/observations/history` : '');

  constructor() {
    this.auth.supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN') {
        if (!this.loaded) {
          this.loadHistoryFromBackend();
        }
        this.loaded = true;
      }
      if (event === 'SIGNED_OUT') {
        this.deleteHistoryInstance();
        this.loaded = false;
      }
    })

    // Only fetch if user is present and no data loaded yet
    const user = this.auth.user();
    if (user && !this.loaded && (!this.history() || this.history().length === 0)) {
      this.loadHistoryFromBackend();
    }
  }

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
      validators: [Validators.min(0), Validators.max(30)]
    },
    {
      title: 'ifGain',
      alias: 'IF Gain',
      type: 'text',
      validators: [Validators.min(0), Validators.max(30)]
    },
    {
      title: 'bbGain',
      alias: 'BB Gain',
      type: 'text',
      validators: [Validators.min(0), Validators.max(30)]
    },
    {
      title: 'ra',
      alias: 'RA',
      type: 'text',
      validators: [Validators.min(0), Validators.max(359)]
    },
    {
      title: 'dec',
      alias: 'DEC',
      type: 'text',
      validators: [Validators.min(0), Validators.max(90)]
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
    {
      title: 'prefEmail',
      alias: 'Preferred Email',
      type: 'text',
      defaultValue: "",
      validators: [Validators.required, Validators.email]
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

  readonly history = signal<observationSubmissionDTO[] | []>([]);

  // ...existing code... (keep your existing fields config)

  addSubmission(submission: observationSubmissionDTO) {
    // Add to top of list
    this.history.update(list => [submission, ...(list as observationSubmissionDTO[])]);
  }

  updateSubmissionStatus(submission: observationSubmissionDTO, status: ObservationStatusDTO) {
    // Update specific item completely immutably
    this.history.update(hist =>
      (hist as observationSubmissionDTO[]).map(obs => {
        if (obs.output_filename === submission.output_filename) {
          obs.status = status;
        }
        return obs;
      })
    );
  }

  deleteHistoryInstance() {
    this.history.update(() => {
      return [];
    });
  }

  async submitObservation(reqBody: observationBodyDTO, accessToken?: string) {
    return fetch(this.submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify(reqBody),
    });
  }

  async loadHistoryFromBackend() {
    if (!this.historyUrl) {
      // Backend history endpoint is optional until implemented.
      return;
    }

    try {
      const accessToken = this.auth.getAccessToken();
      const res = await fetch(this.historyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        }
      });

      if (!res.ok) {
        console.error(`Failed to fetch observation history: ${res.status}`);
        return;
      }

      const payload = await res.json();
      const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);

      this.history.update(() => items as observationSubmissionDTO[]);
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load observation history from backend', error);
    }
  }

}
