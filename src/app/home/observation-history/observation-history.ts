import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-observation-history',
  imports: [
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './observation-history.html',
  styleUrl: './observation-history.scss',
})

export class ObservationHistory {

}
