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
    console.log('Trying to sign up:', this.email);

    this.signUp.signUp(this.name, this.email, this.nick, this.password).subscribe({
      next: (res: any) => {
        console.log('Success! Server response:', res);
        alert("Account created successfully!\nPlease log in now");
        this.signUpSuccess.emit();
        this.close.emit();
      },
      error: (err: any) => {
        if (err.status === 422 && err.error.errors) {
          const errors = err.error.errors;
          
          const firstKey = Object.keys(errors)[0];
          this.errorMessage = errors[firstKey][0]; 
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
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
