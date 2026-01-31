import { Component, effect, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { observationSubmissionSignal } from '../../../services/signal';
import { observationFormDTO , observationSubmissionDTO } from '../control-panel/dtos/control-panel.dto';
import { ObservationsService } from '../../../services/observations';

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
  
  // Directly reference the service signal
  observationSubmissions = this.obsService.history;
}