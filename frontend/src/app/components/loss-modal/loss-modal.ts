import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-loss-modal',
  standalone: true,
  imports: [],
  templateUrl: './loss-modal.html',
  styleUrl: './loss-modal.css',
})
export class LossModal {

  @Output() close = new EventEmitter<void>();

  onBackToGames() {
    this.close.emit(); 
  }
}