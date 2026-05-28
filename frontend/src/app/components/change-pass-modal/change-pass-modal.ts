import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-pass-modal',
  imports: [FormsModule],
  templateUrl: './change-pass-modal.html',
  styleUrl: './change-pass-modal.css',
  standalone: true
})
export class ChangePassModal {

  @Output() close = new EventEmitter<void>();
  @Output() toBack = new EventEmitter<void>();
  errorMessage = '';
  email = '';

  onBack() {
    this.close.emit();
    this.toBack.emit();
  }

  onClose() {
    this.close.emit();
  }
}
