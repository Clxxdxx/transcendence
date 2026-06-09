import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-draw-modal',
  standalone: true,
  imports: [],
  templateUrl: './draw-modal.html',
  styleUrl: './draw-modal.css',
})
export class DrawModal {
  @Output() close = new EventEmitter<void>();

  onBackToGames() {
    this.close.emit(); 
  }
}
