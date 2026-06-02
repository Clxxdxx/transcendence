import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terms-modal',
  imports: [],
  templateUrl: './terms-modal.html',
  styleUrl: './terms-modal.css',
})
export class TermsModal {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
