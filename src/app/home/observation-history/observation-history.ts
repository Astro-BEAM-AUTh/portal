import { Component, effect, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { observationSubmissionSignal } from '../../../services/signal';
import { observationFormDTO , observationSubmissionDTO } from '../control-panel/dtos/control-panel.dto';
import { findIndex } from 'rxjs';

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

  observationSubmissions = signal<(observationSubmissionDTO)[]>([]);
  previousSubmission: observationFormDTO | observationSubmissionDTO | null = null;
  previousStatus: String | null = null;

  constructor(){
    effect(()=>{
      //TODO: Store history persistantly per user

      //filter out any null elements
      if(observationSubmissionSignal() == null || this.previousSubmission == null){
        this.observationSubmissions.update((self: any) => {
          let returnedArray = [...self.filter(
            (e:any)=> {
              if(e !== null){ 
                return e;
              }
            }), observationSubmissionSignal()];

          return returnedArray
        })
      }

      //change status
      this.observationSubmissions.update((self: (observationSubmissionDTO)[]) => {
        const indexOfDifferentStatus = this.observationSubmissions().findIndex((e: observationSubmissionDTO) => {
          if(observationSubmissionSignal() as observationFormDTO === e as observationFormDTO && e != observationSubmissionSignal()){
            return true
          }
          return false;
        })

        self[indexOfDifferentStatus].status = observationSubmissionSignal()?.status as ("Finished"| "Pending" | "Rejected" | "Failed");
        return self
      })
      

      if(observationSubmissionSignal()?.status)

      this.previousSubmission = observationSubmissionSignal();
    })
  }
}
