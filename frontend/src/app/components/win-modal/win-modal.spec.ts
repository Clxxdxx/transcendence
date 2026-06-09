import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinModal } from './win-modal';

describe('WinModal', () => {
  let component: WinModal;
  let fixture: ComponentFixture<WinModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinModal],
    }).compileComponents();

    fixture = TestBed.createComponent(WinModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
