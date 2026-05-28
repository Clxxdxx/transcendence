import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpModal } from './sign-up-modal';

describe('SignUpModal', () => {
  let component: SignUpModal;
  let fixture: ComponentFixture<SignUpModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
