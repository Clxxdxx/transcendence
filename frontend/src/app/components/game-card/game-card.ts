import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  @Input() title: string = '';
  @Input() svgPath: string = '';

  playVsAi() {
    console.log('Click en ${this.title} modo ia');
  }

  playRanked() {
    console.log('Click en ${this.title} modo ranked');
  }
}
