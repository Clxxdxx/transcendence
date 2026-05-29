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
    console.log("Enviando a verificar -> Email:", this.email, "Código:", this.code);
    // Paso 1: Verificar si el código es correcto
    this.c_email.verifyCode(this.email, this.code).subscribe({
      next: () => {
        
        // Paso 2: El código es correcto, ahora buscamos el ID mediante el email
        this.userService.getIdByEmail(this.email).subscribe({
          next: (res: any) => {
            const userId = res.id_user; // ¡Ya tenemos el ID de forma segura!

            // Paso 3: Cambiamos la contraseña usando el ID obtenido
            this.userService.updatePassword(userId, this.newPassword).subscribe({
              next: () => {
                alert("Contraseña actualizada con éxito. Ya puedes iniciar sesión.");
                this.close.emit(); // Cerramos el modal
              },
              error: () => {
                this.errorMessage = "No se pudo guardar la nueva contraseña.";
              }
            });
          },
          error: (err: any) => {
            // Si Laravel devuelve 404 porque el correo no existe
            this.errorMessage = "El correo electrónico no está registrado.";
          }
        });

      },
      error: (err: any) => {
        this.errorMessage = "El código de verificación es incorrecto o ha expirado.";
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
