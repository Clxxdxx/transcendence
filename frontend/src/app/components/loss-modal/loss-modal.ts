import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loss-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loss-modal.html',
  styleUrl: './loss-modal.css',
})
export class LossModal {
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
