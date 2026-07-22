import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Email } from '../../services/email';
import { User } from '../../services/user';

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
  @Input() email: string = '';
  errorMessage = '';

  code: string = '';
  newPassword: string = '';
  
  constructor(private c_email: Email, private userService: User) {}

  onConfirm() {
    this.errorMessage = '';
    console.log("Sending verification code -> Email:", this.email, "Code:", this.code);
    this.c_email.verifyCode(this.email, this.code).subscribe({
      next: () => {
        
        this.userService.getIdByEmail(this.email).subscribe({
          next: (res: any) => {
            const userId = res.id_user;

            this.userService.updatePassword(userId, this.newPassword).subscribe({
              next: () => {
                alert("Password updated successfully. You can now log in.");
                this.close.emit();
              },
              error: () => {
                this.errorMessage = "Could not save the new password.";
              }
            });
          },
          error: (err: any) => {
            this.errorMessage = "The email address is not registered.";
          }
        });

      },
      error: (err: any) => {
        this.errorMessage = "The verification code is incorrect or has expired.";
      }
    });
  }

  onBack() {
    this.close.emit();
    this.toBack.emit();
  }

  onClose() {
    this.close.emit();
  }
}
