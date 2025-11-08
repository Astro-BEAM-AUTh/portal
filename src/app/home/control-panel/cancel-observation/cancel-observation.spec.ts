import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelObservation } from './cancel-observation';

describe('CancelObservation', () => {
  let component: CancelObservation;
  let fixture: ComponentFixture<CancelObservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelObservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelObservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
