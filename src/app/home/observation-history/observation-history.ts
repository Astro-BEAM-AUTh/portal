import { Component, effect, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { observationSubmissionSignal } from '../../../services/signal';
import { observationFormDTO , observationSubmissionDTO, privilegedObservationSubmissionDTO } from '../control-panel/dtos/control-panel.dto';
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

  constructor(){
  }

  isPrivilegedSubmission(submission: any): submission is privilegedObservationSubmissionDTO{
    return "rf_gain" in submission || "if_gain" in submission || "bb_gain" in submission || "dec" in submission || "ra" in submission 
  }
}