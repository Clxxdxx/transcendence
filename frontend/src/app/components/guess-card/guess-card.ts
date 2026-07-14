import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const NAMES: Record<number, string> = { 1: 'As', 11: 'J', 12: 'Q', 13: 'K' };

@Component({
  selector: 'app-guess-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-card.html',
})
export class GuessCard {
  @Output() close = new EventEmitter<'win' | 'loss' | null>();

  readonly rounds = 10;
  private readonly winThreshold = Math.floor(this.rounds / 2) + 1;
  round = 0;
  score = 0;
  current = 1 + Math.floor(Math.random() * 13);
  last: number | null = null;

  cardName(n: number) {
    return NAMES[n] ?? String(n);
  }

  guess(higher: boolean) {
    const next = 1 + Math.floor(Math.random() * 13);
    const correct = higher ? next >= this.current : next <= this.current;
    if (correct) this.score++;
    this.last = next;
    this.round++;
    this.current = next;

    if (this.round >= this.rounds) {
      this.close.emit(this.score >= this.winThreshold ? 'win' : 'loss');
    }
  }

  exit() {
    this.close.emit(null);
  }
}
