import { Component, effect, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { observationSubmissionSignal } from '../../../services/signal';
import { observationFormDTO , observationSubmissionDTO } from '../control-panel/dtos/control-panel.dto';
import { ObservationsService } from '../../../services/observations';
import { AuthService } from '../../../services/auth';
import { Subscription, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-observation-history',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatExpansionModule
  ],
  templateUrl: './observation-history.html',
  styleUrl: './observation-history.scss',
})

export class ObservationHistory {
  private obsService = inject(ObservationsService);
  observationSubmissions = this.obsService.history;
  private auth = inject(AuthService)
  private authSubscription: any;

  constructor(){
    // A) On page load, check for existing session
    const user = this.auth.user();
    if (user) {
      this.handleState();
    }
  }

  ngOnInit() {
    // B) Listen for new logins
    this.authSubscription = this.auth.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.handleState();
      }
      if (event === 'SIGNED_OUT') {
        this.deleteState();
      }
    }).data.subscription;
  }

  ngOnDestroy(){
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.deleteState()
  }

  // Directly reference the service signal
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
      data.forEach(obs => {
        this.obsService.addSubmission(obs)
      });
    }
  }

  async deleteState(){
    this.obsService.deleteHistoryInstance()
  }
  
}