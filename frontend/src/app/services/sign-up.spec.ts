import { TestBed } from '@angular/core/testing';

import { SignUp } from './sign-up';

describe('SignUp', () => {
  let service: SignUp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
