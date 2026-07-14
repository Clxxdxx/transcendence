import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-win-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './win-modal.html',
  styleUrl: './win-modal.css',
})
export class WinModal {
  @Input() points: number = 0;
  @Input() multiplier: number = 1;
  @Input() isRanked: boolean = false;
  @Input() sessionComplete: boolean = false;
  @Input() totalPoints: number = 0;
  @Output() close = new EventEmitter<void>();

  onBackToGames() {
    this.close.emit();
  }
}
