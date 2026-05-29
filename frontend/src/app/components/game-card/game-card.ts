import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCard {
  @Input() title: string = '';
  @Input() svgPath: string = '';
  @Output() loginRequired = new EventEmitter<void>();

    constructor(private auth: Auth) {}

  playVsAi() {
    console.log('Click en ${this.title} modo ia');
  }

  playRanked() {
    if (!this.auth.isLoggedIn()) {
      console.log('Usuario no logueado. Solicitando inicio de sesión...');
      this.loginRequired.emit();
      return;
    }
    console.log('Click en ${this.title} modo ranked');
  }
}
