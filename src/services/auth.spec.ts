import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';

describe('Authentication', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
