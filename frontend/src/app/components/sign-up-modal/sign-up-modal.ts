import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignUp } from '../../services/sign-up';

@Component({
  selector: 'app-sign-up-modal',
  imports: [FormsModule],
  templateUrl: './sign-up-modal.html',
  styleUrl: './sign-up-modal.css',
  standalone: true
})
export class SignUpModal {
  @Output() close = new EventEmitter<void>();
  @Output() signUpSuccess = new EventEmitter<string>();

  errorMessage = '';
  name = '';
  nick = '';
  email = '';
  password = '';

  constructor(private signUp: SignUp, private cdr: ChangeDetectorRef) {}

  doSignUp() {
    console.log('Intentando crear usuario con:', this.email);

    this.signUp.signUp(this.name, this.email, this.nick, this.password).subscribe({
      next: (res: any) => {
        console.log('¡Éxito! Respuesta del servidor:', res);
        alert("Cuenta creada correctamente!\nInicia sesión ahora");
        this.signUpSuccess.emit();
        this.close.emit();
      },
      error: (err: any) => {
        if (err.status === 422 && err.error.errors) {
          const errors = err.error.errors;
          
          const firstKey = Object.keys(errors)[0];
          this.errorMessage = errors[firstKey][0]; 
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onSwitchToLogin() {
    this.signUpSuccess.emit();
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
