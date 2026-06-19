import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlayers } from './top-players';

describe('TopPlayers', () => {
  let component: TopPlayers;
  let fixture: ComponentFixture<TopPlayers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPlayers],
    }).compileComponents();

    fixture = TestBed.createComponent(TopPlayers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
