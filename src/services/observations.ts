import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { inject, signal, effect } from '@angular/core';
import { observationBodyDTO, ObservationCreateDTO, observationSubmissionDTO, ObservationStatusDTO } from '../app/home/control-panel/dtos/control-panel.dto';
import { OBSERVATION_CREATE_DEFAULTS, OBSERVATION_TYPE_VALUES } from '../api/backend-openapi.runtime';
import { AuthService } from './auth';

type FieldType = 'text' | 'select';
type FieldDataType = 'string' | 'number';

export interface ObservationFieldConfig {
  title: string;
  alias: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | number;
  values?: Array<string | number>;
  validators: unknown[];
  payloadKey?: keyof ObservationCreateDTO;
  dataType?: FieldDataType;
}

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {
  private auth = inject(AuthService);
  private loaded = false;
  private loading = false;
  private loadedScope: string | null = null;
  private backendBaseUrl = (import.meta.env['NG_APP_BACKEND_URL'] || '').replace(/\/$/, '');
  private observationsUrl = `${this.backendBaseUrl}/v1/observations/`;
  private submitUrl = this.observationsUrl;
  private historyUrl = this.observationsUrl;
  readonly guestHistoryDebugEnabled = String(import.meta.env['NG_APP_DEBUG_GUEST_HISTORY'] ?? 'true').toLowerCase() === 'true';

  constructor() {
    // Keep history in sync with auth transitions.
    this.auth.supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_IN') {
        this.loaded = false;
        this.loadedScope = null;
        this.deleteHistoryInstance();
        void this.loadHistoryFromBackend(true);
      }

      if (event === 'SIGNED_OUT') {
        this.deleteHistoryInstance();
        this.loaded = false;
        this.loadedScope = null;
        if (this.guestHistoryDebugEnabled) {
          void this.loadHistoryFromBackend(true);
        }
      }
    })

    // Wait for session to be loaded before attempting to load history
    // This prevents race conditions where the token isn't available yet
    effect(() => {
      if (this.auth.sessionLoaded()) {
        void this.loadHistoryFromBackend();
      }
    });
  }

  observation_fields: ObservationFieldConfig[] = [
    {
      title: 'targetName',
      alias: 'Target Name',
      type: 'text',
      placeholder: 'Enter target name...',
      validators: [Validators.required],
      payloadKey: 'target_name',
      dataType: 'string',
    },
    {
      title: 'observationObject',
      alias: 'Observation Object',
      type: 'text',
      placeholder: 'Enter observation object...',
      validators: [Validators.required],
      payloadKey: 'observation_object',
      dataType: 'string',
    },
    {
      title: 'observationType',
      alias: 'Observation Type',
      type: 'select',
      defaultValue: (OBSERVATION_CREATE_DEFAULTS.observation_type ?? 'target_observation') as ObservationCreateDTO['observation_type'],
      values: [...OBSERVATION_TYPE_VALUES] as Array<ObservationCreateDTO['observation_type']>,
      validators: [Validators.required],
      payloadKey: 'observation_type',
      dataType: 'string',
    },
    {
      title: 'cFreq',
      alias: 'Center Frequency (MHz)',
      type: 'text',
      defaultValue: 1450,
      validators: [Validators.required, Validators.min(0.1)],
      payloadKey: 'center_frequency',
      dataType: 'number',
    },
    {
      title: 'rfGain',
      alias: 'RF Gain',
      type: 'text',
      defaultValue: 0,
      validators: [Validators.required, Validators.min(0), Validators.max(30)],
      payloadKey: 'rf_gain',
      dataType: 'number',
    },
    {
      title: 'ifGain',
      alias: 'IF Gain',
      type: 'text',
      defaultValue: 0,
      validators: [Validators.required, Validators.min(0), Validators.max(30)],
      payloadKey: 'if_gain',
      dataType: 'number',
    },
    {
      title: 'bbGain',
      alias: 'BB Gain',
      type: 'text',
      defaultValue: 0,
      validators: [Validators.required, Validators.min(0), Validators.max(30)],
      payloadKey: 'bb_gain',
      dataType: 'number',
    },
    {
      title: 'ra',
      alias: 'RA',
      type: 'text',
      defaultValue: 0,
      validators: [Validators.required, Validators.min(0), Validators.max(359.999999)],
      payloadKey: 'ra',
      dataType: 'number',
    },
    {
      title: 'dec',
      alias: 'DEC',
      type: 'text',
      defaultValue: 0,
      validators: [Validators.required, Validators.min(-90), Validators.max(90)],
      payloadKey: 'dec',
      dataType: 'number',
    },
    {
      title: 'integrationTime',
      alias: 'Integration Time (seconds)',
      type: 'text',
      defaultValue: 60,
      placeholder: 'Enter integration time in seconds...',
      validators: [Validators.required, Validators.min(0), Validators.max(1800)],
      payloadKey: 'integration_time',
      dataType: 'number',
    },
    {
      title: 'prefEmail',
      alias: 'Preferred Email',
      type: 'text',
      defaultValue: "",
      validators: [Validators.required, Validators.email]
    },

  /*
  integration duration same as integration time in s
  autogen output filename
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

  async loadHistoryFromBackend(forceReload = false) {
    const userId = this.auth.getCurrentUserId();
    const currentScope = userId ? `user:${userId}` : (this.guestHistoryDebugEnabled ? 'guest' : null);

    if (!currentScope) {
      return;
    }

    if (!this.historyUrl) {
      // Observation list endpoint is optional until backend connectivity is configured.
      return;
    }

    if (!forceReload && (this.loading || (this.loaded && this.loadedScope === currentScope))) {
      return;
    }

    try {
      this.loading = true;
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

      // If auth context changed while awaiting network, do not commit stale results.
      const latestUserId = this.auth.getCurrentUserId();
      const latestScope = latestUserId ? `user:${latestUserId}` : (this.guestHistoryDebugEnabled ? 'guest' : null);
      if (latestScope !== currentScope) {
        return;
      }

      this.history.update(() => items as observationSubmissionDTO[]);
      this.loaded = true;
      this.loadedScope = currentScope;
    } catch (error) {
      console.error('Failed to load observation history from backend', error);
    } finally {
      this.loading = false;
    }
  }

}
