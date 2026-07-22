import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const WORDS = ['USERS', 'GAMES', 'POINT', 'SCORE', 'LOGIN', 'EMAIL', 'NICKN', 'ADMIN', 'TOKEN', 'BOARD'];

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wordle.html',
})
export class Wordle {
  @Output() close = new EventEmitter<'win' | 'loss' | null>();

  word = WORDS[Math.floor(Math.random() * WORDS.length)];
  guesses: string[] = [];
  current = '';
  readonly maxGuesses = 6;

  onKey(key: string) {
    if (key === 'ENTER') return this.submit();
    if (key === 'BACK') return (this.current = this.current.slice(0, -1));
    if (/^[A-ZÑ]$/.test(key) && this.current.length < 5) this.current += key;
  }

  submit() {
    if (this.current.length !== 5) return;
    this.guesses.push(this.current);
    const guess = this.current;
    this.current = '';
    if (guess === this.word) {
      this.close.emit('win');
    } else if (this.guesses.length >= this.maxGuesses) {
      this.close.emit('loss');
    }
  }

  letterState(guess: string, i: number): 'correct' | 'present' | 'absent' {
    const letter = guess[i];
    if (this.word[i] === letter) return 'correct';
    if (this.word.includes(letter)) return 'present';
    return 'absent';
  }

  exit() {
    this.close.emit(null);
  }
}
