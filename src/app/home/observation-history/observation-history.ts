import { Component, effect, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { observationSubmissionSignal } from '../../../services/signal';

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

  observationSubmissions: any = signal([]);

  constructor(){
    effect(()=>{
      this.observationSubmissions.update((self: any) => [...self.filter((e:any)=> {if(e !== null) return e}), observationSubmissionSignal()])
      console.log(this.observationSubmissions())
    })
  }
}
