import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassModal } from './change-pass-modal';

describe('ChangePassModal', () => {
  let component: ChangePassModal;
  let fixture: ComponentFixture<ChangePassModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
