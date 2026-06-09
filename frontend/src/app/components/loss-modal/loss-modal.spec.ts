import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossModal } from './loss-modal';

describe('LossModal', () => {
  let component: LossModal;
  let fixture: ComponentFixture<LossModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LossModal],
    }).compileComponents();

    fixture = TestBed.createComponent(LossModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
