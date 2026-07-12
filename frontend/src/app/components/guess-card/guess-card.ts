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

  readonly rounds = 5;
  round = 0;
  score = 0;
  current = 1 + Math.floor(Math.random() * 13);
  last: number | null = null;
  gameOver = false;
  message = '';

  cardName(n: number) {
    return NAMES[n] ?? String(n);
  }

  guess(higher: boolean) {
    if (this.gameOver) return;
    const next = 1 + Math.floor(Math.random() * 13);
    const correct = higher ? next >= this.current : next <= this.current;
    if (correct) this.score++;
    this.last = next;
    this.round++;
    this.current = next;

    if (this.round >= this.rounds) {
      this.gameOver = true;
      this.message = this.score >= 3 ? '¡Has ganado!' : 'Has perdido';
    }
  }

  restart() {
    this.round = 0;
    this.score = 0;
    this.current = 1 + Math.floor(Math.random() * 13);
    this.last = null;
    this.gameOver = false;
    this.message = '';
  }

  exit() {
    if (!this.gameOver) return this.close.emit(null);
    this.close.emit(this.message === '¡Has ganado!' ? 'win' : 'loss');
  }
}
