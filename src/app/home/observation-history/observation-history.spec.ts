import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationHistory } from './observation-history';

describe('ObservationsHistory', () => {
  let component: ObservationHistory;
  let fixture: ComponentFixture<ObservationHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
