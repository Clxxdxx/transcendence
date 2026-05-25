import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { GameCard } from './components/game-card/game-card';
import { AuthModal } from './components/auth-modal/auth-modal';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Navbar, GameCard, AuthModal, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  games = [
      { title: 'Tic-Tac-Toe', svg: '/icons/tic-tac-toe.svg' },
      { title: 'Wordle', svg: '/icons/wordle.svg' },
      { title: 'Pong', svg: '/icons/pong.svg' },
      { title: 'Guess card', svg: '/icons/guess_card.svg' },
      { title: 'Arkanoid', svg: '/icons/arkanoid.svg' },
      { title: 'Connect 4', svg: '/icons/connect4.svg' }
    ];

    isLoginModalOpen = false;
    isLoggedIn = false;
    userInitial = '';

    onLoginSuccess(email: string){
      this.isLoggedIn = true;
      this.userInitial = email.charAt(0).toUpperCase();
    }

    onLogout(){
      this.isLoggedIn = false;
    }
}
