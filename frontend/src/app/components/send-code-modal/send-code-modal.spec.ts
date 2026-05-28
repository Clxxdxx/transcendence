import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCodeModal } from './send-code-modal';

describe('SendCodeModal', () => {
  let component: SendCodeModal;
  let fixture: ComponentFixture<SendCodeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendCodeModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SendCodeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
