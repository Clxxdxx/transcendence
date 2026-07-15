import { Component, OnInit } from '@angular/core';
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
import { User } from './services/user';
import { Leaderboard } from './components/leaderboard/leaderboard';
import { Profile } from './components/profile/profile';
import { LossModal } from './components/loss-modal/loss-modal';
import { WinModal } from './components/win-modal/win-modal';
import { DrawModal } from './components/draw-modal/draw-modal';
import { ChatGlobal } from './components/chat-global/chat-global';
import { TopPlayers } from './components/top-players/top-players';
import { ChatService } from './services/chat-global';
import { Pong } from './components/pong/pong';
import { TicTacToe } from './components/tic-tac-toe/tic-tac-toe';
import { Arkanoid } from './components/arkanoid/arkanoid';
import { Wordle } from './components/wordle/wordle';
import { GuessCard } from './components/guess-card/guess-card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Navbar, GameCard, AuthModal, Footer,
    SignUpModal, SendCodeModal, ChangePassModal, TermsModal,
    Leaderboard, Profile, LossModal, WinModal, DrawModal, Pong, TicTacToe, Arkanoid, Wordle, GuessCard,
    ChatGlobal, TopPlayers],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  games = [
    { title: 'Tic-Tac-Toe', svg: '/icons/tic-tac-toe.svg' },
    { title: 'Wordle', svg: '/icons/wordle.svg' },
    { title: 'Pong', svg: '/icons/pong.svg' },
    { title: 'Guess card', svg: '/icons/guess_card.svg' },
    { title: 'Arkanoid', svg: '/icons/arkanoid.svg' },
    { title: 'Connect 4', svg: '/icons/connect4.svg' }
  ];

  private readonly RANKED_GAMES = ['Tic-Tac-Toe', 'Wordle', 'Pong', 'Guess card', 'Arkanoid'];
  private readonly POINTS_WIN = 100;
  private readonly POINTS_DRAW = 30;
  private readonly POINTS_LOSS = 10;

  constructor(private auth: Auth, private chatService: ChatService, private userService: User) {}

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
  currentUserId: number | null = null;

  // Ranked mode state
  isRankedMode = false;
  rankedCompletedGames: string[] = [];
  rankedSessionPoints = 0;
  rankedLastPoints = 0;
  rankedLastMultiplier = 1;
  rankedSessionComplete = false;
  rankedTotalPoints = 0;

  private gameStartTime = 0;

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      const savedEmail = this.auth.getEmail();
      if (savedEmail) this.userInitial = savedEmail.charAt(0).toUpperCase();
      this.loadCurrentUser();
    }
  }

  private loadCurrentUser() {
    this.userService.getAuthUser().subscribe({
      next: (user) => { this.currentUserId = user.id_user; },
      error: () => {}
    });
  }

  onLoginSuccess(email: string) {
    this.isLoggedIn = true;
    this.userInitial = email.charAt(0).toUpperCase();
    this.chatService.connect();
    this.loadCurrentUser();
  }

  onSignUpSuccess() {
    this.isSignUpModalOpen = false;
    this.isLoginModalOpen = true;
  }

  toSendCodeModal() {
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

  onConfirmPass() { this.isChangePassModalOpen = false; }
  onBackToCode() { this.isChangePassModalOpen = false; this.isSendCodeModalOpen = true; }
  onBack() { this.isSendCodeModalOpen = false; this.isLoginModalOpen = true; }

  onLogout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.currentView = 'games';
    this.currentUserId = null;
    this.resetRankedSession();
    this.isRankedMode = false;
    this.chatService.disconnect();
  }

  // Ranked mode
  toggleRankedMode() {
    if (!this.auth.isLoggedIn()) {
      this.isLoginModalOpen = true;
      return;
    }
    this.isRankedMode = !this.isRankedMode;
  }


    onLogout(){
      this.auth.logout().subscribe({
        error: () => {}
      });
      this.isLoggedIn = false;
      this.currentView = 'games';
      this.chatService.disconnect();
    }

  private resetRankedSession() {
    this.rankedCompletedGames = [];
    this.rankedSessionPoints = 0;
    this.rankedLastPoints = 0;
    this.rankedLastMultiplier = 1;
    this.rankedSessionComplete = false;
    this.rankedTotalPoints = 0;
  }


  isGameLockedInRanked(title: string): boolean {
    return this.isRankedMode && this.rankedCompletedGames.includes(title);
  }

  // Gradual exponential decay: m(t) = 1 + (maxMult - 1) * e^(-k * t)
  // k is chosen so the multiplier hits specific reference points per game.
  private getTimeMultiplier(gameTitle: string, elapsedMs: number): number {
    const t = elapsedMs / 1000;
    let maxMult: number;
    let k: number;

    switch (gameTitle) {
      case 'Tic-Tac-Toe':
        // t=1s→×5, t=20s→×3, t=30s→×2.5, t=60s→×1.7
        maxMult = 5; k = 0.0365; break;
      case 'Wordle':
        // t=10s→×4.7, t=60s→×3, t=120s→×2, t=240s→×1.3
        maxMult = 5; k = 0.0116; break;
      case 'Pong':
        // t=30s→×4.2, t=120s→×3, t=300s→×1.8, t=480s→×1.3
        maxMult = 5; k = 0.0058; break;
      case 'Guess card':
        // t=5s→×4.7, t=30s→×3, t=60s→×2, t=120s→×1.3
        maxMult = 5; k = 0.0231; break;
      case 'Arkanoid':
        // t=60s→×4.2, t=180s→×3, t=420s→×1.8, t=600s→×1.4
        maxMult = 5; k = 0.0039; break;
      default:
        return 1;
    }

    return Math.max(1, 1 + (maxMult - 1) * Math.exp(-k * t));
  }

  private handleRankedResult(gameTitle: string, result: 'win' | 'loss' | 'draw') {
    if (!this.isRankedMode) return;

    const elapsed = Date.now() - this.gameStartTime;
    const rawMultiplier = this.getTimeMultiplier(gameTitle, elapsed);
    const displayMultiplier = Math.round(rawMultiplier * 10) / 10;

    let basePoints = 0;
    if (result === 'win')       basePoints = this.POINTS_WIN;
    else if (result === 'draw') basePoints = this.POINTS_DRAW;
    else                        basePoints = this.POINTS_LOSS;

    const points = Math.round(basePoints * rawMultiplier);

    this.rankedLastPoints = points;
    this.rankedLastMultiplier = displayMultiplier;
    this.rankedSessionPoints += points;
    this.rankedCompletedGames = [...this.rankedCompletedGames, gameTitle];

    const allDone = this.RANKED_GAMES.every(g => this.rankedCompletedGames.includes(g));
    if (allDone) {
      this.rankedSessionComplete = true;
      this.rankedTotalPoints = this.rankedSessionPoints;
      this.saveRankedPoints(this.rankedSessionPoints);
      this.rankedCompletedGames = [];
      this.rankedSessionPoints = 0;
    }
  }

  // Quit in ranked: block the game and award 0 points
  private handleRankedQuit(gameTitle: string) {
    if (!this.isRankedMode) return;

    this.rankedLastPoints = 0;
    this.rankedLastMultiplier = 1;
    this.rankedCompletedGames = [...this.rankedCompletedGames, gameTitle];

    const allDone = this.RANKED_GAMES.every(g => this.rankedCompletedGames.includes(g));
    if (allDone) {
      this.rankedSessionComplete = true;
      this.rankedTotalPoints = this.rankedSessionPoints;
      this.saveRankedPoints(this.rankedSessionPoints);
      this.rankedCompletedGames = [];
      this.rankedSessionPoints = 0;
    }
  }

  private saveRankedPoints(points: number) {
    if (this.currentUserId && points > 0) {
      this.userService.addPoints(this.currentUserId, points).subscribe({
        error: err => console.error('Error saving ranked points', err)
      });
    }
  }

  onPlayVsAi(title: string) {
    this.gameStartTime = Date.now();
    if (title === 'Pong')        this.currentView = 'pong';
    if (title === 'Tic-Tac-Toe') this.currentView = 'tic-tac-toe';
    if (title === 'Arkanoid')    this.currentView = 'arkanoid';
    if (title === 'Wordle')      this.currentView = 'wordle';
    if (title === 'Guess card')  this.currentView = 'guess-card';
  }

  onPongClose(result: 'win' | 'loss' | null) {
    this.currentView = 'games';
    this.rankedSessionComplete = false;
    if (result === 'win')  { this.handleRankedResult('Pong', 'win');  this.isWinModalOpen = true; }
    if (result === 'loss') { this.handleRankedResult('Pong', 'loss'); this.isLossModalOpen = true; }
    if (result === null)   { this.handleRankedQuit('Pong');           if (this.isRankedMode) this.isLossModalOpen = true; }
  }

  onTicTacToeClose(result: 'win' | 'loss' | 'draw' | null) {
    this.currentView = 'games';
    this.rankedSessionComplete = false;
    if (result === 'win')  { this.handleRankedResult('Tic-Tac-Toe', 'win');  this.isWinModalOpen = true; }
    if (result === 'loss') { this.handleRankedResult('Tic-Tac-Toe', 'loss'); this.isLossModalOpen = true; }
    if (result === 'draw') { this.handleRankedResult('Tic-Tac-Toe', 'draw'); this.isDrawModalOpen = true; }
    if (result === null)   { this.handleRankedQuit('Tic-Tac-Toe');           if (this.isRankedMode) this.isLossModalOpen = true; }
  }

  onArkanoidClose(result: 'win' | 'loss' | null) {
    this.currentView = 'games';
    this.rankedSessionComplete = false;
    if (result === 'win')  { this.handleRankedResult('Arkanoid', 'win');  this.isWinModalOpen = true; }
    if (result === 'loss') { this.handleRankedResult('Arkanoid', 'loss'); this.isLossModalOpen = true; }
    if (result === null)   { this.handleRankedQuit('Arkanoid');           if (this.isRankedMode) this.isLossModalOpen = true; }
  }

  onWordleClose(result: 'win' | 'loss' | null) {
    this.currentView = 'games';
    this.rankedSessionComplete = false;
    if (result === 'win')  { this.handleRankedResult('Wordle', 'win');  this.isWinModalOpen = true; }
    if (result === 'loss') { this.handleRankedResult('Wordle', 'loss'); this.isLossModalOpen = true; }
    if (result === null)   { this.handleRankedQuit('Wordle');           if (this.isRankedMode) this.isLossModalOpen = true; }
  }

  onGuessCardClose(result: 'win' | 'loss' | null) {
    this.currentView = 'games';
    this.rankedSessionComplete = false;
    if (result === 'win')  { this.handleRankedResult('Guess card', 'win');  this.isWinModalOpen = true; }
    if (result === 'loss') { this.handleRankedResult('Guess card', 'loss'); this.isLossModalOpen = true; }
    if (result === null)   { this.handleRankedQuit('Guess card');           if (this.isRankedMode) this.isLossModalOpen = true; }
  }
}
