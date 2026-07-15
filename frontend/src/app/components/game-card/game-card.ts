import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() isLockedInRanked: boolean = false;
  @Output() vsAiClicked = new EventEmitter<string>();

  playVsAi() {
    this.vsAiClicked.emit(this.title);
  }
}
