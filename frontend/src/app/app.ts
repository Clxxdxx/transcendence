import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { GameCard } from './components/game-card/game-card';
import { AuthModal } from './components/auth-modal/auth-modal';
import { SignUpModal } from './components/sign-up-modal/sign-up-modal';
import { SendCodeModal } from './components/send-code-modal/send-code-modal';
import { ChangePassModal } from './components/change-pass-modal/change-pass-modal';
import { Footer } from './components/footer/footer';
import { TermsModal } from './components/terms-modal/terms-modal';
import { Auth } from './services/auth';
import { Leaderboard } from './components/leaderboard/leaderboard';
import { Profile } from './components/profile/profile';
import { LossModal } from './components/loss-modal/loss-modal';
import { WinModal } from './components/win-modal/win-modal';
import { DrawModal } from './components/draw-modal/draw-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Navbar, GameCard, AuthModal, Footer, 
    SignUpModal, SendCodeModal, ChangePassModal, TermsModal,
    Leaderboard, Profile, LossModal, WinModal, DrawModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  games = [
      { title: 'Tic-Tac-Toe', svg: '/icons/tic-tac-toe.svg' },
      { title: 'Wordle', svg: '/icons/wordle.svg' },
      { title: 'Pong', svg: '/icons/pong.svg' },
      { title: 'Guess card', svg: '/icons/guess_card.svg' },
      { title: 'Arkanoid', svg: '/icons/arkanoid.svg' },
      { title: 'Connect 4', svg: '/icons/connect4.svg' }
    ];

    constructor(private auth: Auth) {}

    isLoginModalOpen = false;
    isSignUpModalOpen = false;
    isSendCodeModalOpen = false;
    isChangePassModalOpen = false;
    isTermsModalOpen = false;
    isLossModalOpen = false;
    isWinModalOpen = false;
    isDrawModalOpen = false;
    emailParaCambiar: string = '';
    isLoggedIn = false;
    userInitial = '';
    currentView: string = 'games';

    ngOnInit(){
      this.isLoggedIn = this.auth.isLoggedIn();
      if (this.isLoggedIn) {
        const savedEmail = this.auth.getEmail()
        if (savedEmail) {
          this.userInitial = savedEmail.charAt(0).toUpperCase();
        }
      }
    }

    onLoginSuccess(email: string){
      this.isLoggedIn = true;
      this.userInitial = email.charAt(0).toUpperCase();
    }

    onSignUpSuccess() {
      this.isSignUpModalOpen = false;
      this.isLoginModalOpen = true;
    }

    toSendCodeModal(){
      this.isSendCodeModalOpen = true;
      this.isLoginModalOpen = false;
    }

    toSignUp() {
      this.isSignUpModalOpen = true;
      this.isLoginModalOpen = false;
    }

    toChangePass(emailRecibido: string) {
      this.emailParaCambiar = emailRecibido;
      this.isSendCodeModalOpen = false;
      this.isChangePassModalOpen = true;
    }

    onConfirmPass(){
      this.isChangePassModalOpen = false;
    }

    onBackToCode() {
      this.isChangePassModalOpen = false;
      this.isSendCodeModalOpen = true;
    }

    onBack() {
      this.isSendCodeModalOpen = false;
      this.isLoginModalOpen = true;
    }

    onLogout(){
      this.auth.logout();
      this.isLoggedIn = false;
      this.currentView = 'games';
    }
}
