import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-win-modal',
  standalone: true,
  imports: [],
  templateUrl: './win-modal.html',
  styleUrl: './win-modal.css',
})
export class WinModal {
  @Output() close = new EventEmitter<void>();

  onBackToGames() {
    this.close.emit(); 
  }
}
