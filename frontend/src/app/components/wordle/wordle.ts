import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const WORDS = ['GATOS', 'PATOS', 'JUEGO', 'PIZZA', 'PLAYA', 'RATON', 'CARRO', 'VERDE'];

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
  gameOver = false;
  message = '';
  readonly maxGuesses = 6;

  onKey(key: string) {
    if (this.gameOver) return;
    if (key === 'ENTER') return this.submit();
    if (key === 'BACK') return (this.current = this.current.slice(0, -1));
    if (/^[A-ZÑ]$/.test(key) && this.current.length < 5) this.current += key;
  }

  submit() {
    if (this.current.length !== 5) return;
    this.guesses.push(this.current);
    if (this.current === this.word) {
      this.gameOver = true;
      this.message = '¡Has ganado!';
    } else if (this.guesses.length >= this.maxGuesses) {
      this.gameOver = true;
      this.message = `Has perdido. La palabra era ${this.word}`;
    }
    this.current = '';
  }

  letterState(guess: string, i: number): 'correct' | 'present' | 'absent' {
    const letter = guess[i];
    if (this.word[i] === letter) return 'correct';
    if (this.word.includes(letter)) return 'present';
    return 'absent';
  }

  restart() {
    this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
    this.guesses = [];
    this.current = '';
    this.gameOver = false;
    this.message = '';
  }

  exit() {
    if (!this.gameOver) return this.close.emit(null);
    this.close.emit(this.message.startsWith('¡Has ganado') ? 'win' : 'loss');
  }
}
