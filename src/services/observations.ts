import { Inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { observationFormDTO, observationSubmissionDTO } from '../app/home/control-panel/dtos/control-panel.dto';
import { AuthService } from './auth';
import { inject } from '@angular/core/primitives/di';

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {
  private auth = inject(AuthService)
  private loaded = false;

  constructor(){
    this.auth.supabase.auth.onAuthStateChange((event, session)=>{
      if (event === 'SIGNED_IN') {
        if(!this.loaded){
          this.handleState();
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
      this.handleState();
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

  updateSubmissionStatus(submission: observationSubmissionDTO, status: "Finished"| "Pending" | "Rejected" | "Failed") {
    // Update specific item completely immutably
    this.history.update(hist => 
      (hist as observationSubmissionDTO[]).map(obs => {
        // Remove status and message from both objects for comparison
        const { status: obsStatus, message: obsMessage, ...obsRest } = obs;
        const { status: subStatus, message: subMessage, ...subRest } = submission;
        if(JSON.stringify(obsRest) === JSON.stringify(subRest)){
          obs.status = status
        }
        return obs }
      )
    );
  }

  deleteHistoryInstance(){
    this.history.update(()=>{return []})
  }

  async handleState(){
    const email = this.auth.user()?.email
    const {data, error} = await this.auth.supabase
    .from('observations')
    .select('*')
    .eq('email', email)

    if (error) {
      console.error(error);
    } else {
      // data contains all observations for this user
      this.loaded = true;
      data.forEach(obs => {
        this.addSubmission(obs)
      });
    }
  }
  
}
