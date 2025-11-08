import { TestBed } from '@angular/core/testing';

import { Observations } from './observations';

describe('Observations', () => {
  let service: Observations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Observations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
