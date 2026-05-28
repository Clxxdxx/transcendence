import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Email } from '../../services/email';

@Component({
  selector: 'app-send-code-modal',
  imports: [FormsModule],
  templateUrl: './send-code-modal.html',
  styleUrl: './send-code-modal.css',
  standalone: true
})
export class SendCodeModal {
  @Output() close = new EventEmitter<void>();
  @Output() toBack = new EventEmitter<void>();
  @Output() toSendCode = new EventEmitter<void>();
  errorMessage = '';
  email = '';

  constructor(private c_email: Email, private cdr: ChangeDetectorRef) {}

  onBack() {
    this.close.emit();
    this.toBack.emit();
  }

  onClose() {
    this.close.emit();
  }

  onSendCode(){
    this.errorMessage = '';

    this.c_email.sendCode(this.email).subscribe({
      next: (res: any) => {
        this.toSendCode.emit();
        alert("Code sent succesfully!");
      },
      error: (err: any) => {
        if (err.status === 422) {
          this.errorMessage = "Este correo no está registrado.";
          console.log('error');
        } else {
            this.errorMessage = 'Error al enviar el código.';
        }
        this.cdr.detectChanges();
      }
    })
  }
}
