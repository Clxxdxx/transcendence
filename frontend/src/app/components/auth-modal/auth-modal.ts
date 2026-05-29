import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  @Output() toSignUp= new EventEmitter<string>();
  @Output() forgotPassClicked = new EventEmitter<void>();

  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private cdr: ChangeDetectorRef) {}

  doLogin() {
    console.log('Intentando loguear con:', this.email);

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('¡Éxito! Respuesta del servidor:', res);
        this.auth.setToken(res.access_token);
        this.auth.setEmail(res.user.email);
        this.auth.setId(res.user.id_user);
        this.loginSuccess.emit(this.email); 
        this.close.emit();
      },
      error: (err: any) => {
        if (err.status === 422 && err.error.errors) {
          const errors = err.error.errors;
          
          const firstKey = Object.keys(errors)[0];
          this.errorMessage = errors[firstKey][0]; 
        } else {
          this.errorMessage = 'Invalid password';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onSignUp() {
    this.toSignUp.emit();
    this.close.emit();
  }

  onForgotPass(){
    this.forgotPassClicked.emit();
    console.log("CCCCCCCCCCCCC");
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }


}
