import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-auth-modal',
  imports: [FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
  standalone: true
})
export class AuthModal {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();

  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth) {}

  doLogin() {
    console.log('Intentando loguear con:', this.email); // Debug

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('¡Éxito! Respuesta del servidor:', res);
        alert('Usuario logueado correctamente'); // Feedback visual rápido
        this.loginSuccess.emit(this.email); 
        this.close.emit();
      },
      error: (err: any) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Credenciales incorrectas o fallo en el servidor';
        alert('Error' + this.errorMessage);
      }
    });
  }


  onClose() {
    this.close.emit();
  }


}
