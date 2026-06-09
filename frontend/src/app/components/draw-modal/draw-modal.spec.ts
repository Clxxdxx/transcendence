import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawModal } from './draw-modal';

describe('DrawModal', () => {
  let component: DrawModal;
  let fixture: ComponentFixture<DrawModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
