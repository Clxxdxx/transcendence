import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
    @Output() loginClicked = new EventEmitter<void>();
    @Output() signUpClicked = new EventEmitter<void>();
    @Output() sendCodeClicked = new EventEmitter<void>();
    @Output() logout = new EventEmitter<void>();
    @Output() loginRequired = new EventEmitter<void>();
    @Output() viewChanged = new EventEmitter<string>();

    constructor(private auth: Auth) {}
    
    @Input() isLoggedIn: boolean = false;
    @Input() userInitial: string = '';

    onGames() {
      this.viewChanged.emit('games');
    }

    onLeaderboard() {
      if (!this.auth.isLoggedIn()) {
        console.log('User not logged in. Requesting login...');
        this.loginRequired.emit();
        return;
      }
      this.viewChanged.emit('leaderboard');
    }

    onProfile() {
      if (!this.auth.isLoggedIn()) {
        console.log('User not logged in. Requesting login...');
        this.loginRequired.emit();
        return;
      }
      this.viewChanged.emit('profile');
    }

}
