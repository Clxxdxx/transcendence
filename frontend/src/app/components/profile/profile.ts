import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user';
import { forkJoin } from 'rxjs'; // 1. Import forkJoin to control the async flow

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  userId!: number;

  name: string = '';
  nick: string = '';

  errorMessage = '';

  totalWins: number = 0;
  totalLosses: number = 0;
  gameStats: any[] = [];
  recentActivity: any[] = [];

  isSaving: boolean = false;

  getGameIcon(gameName: string): string {
  const iconsMap: { [key: string]: string } = {
    'Tic-Tac-Toe': 'tic-tac-toe.svg',
    'Wordle': 'wordle.svg',
    'Pong': 'pong.svg',
    'Guess Card': 'guess_card.svg',
    'Arkanoid': 'arkanoid.svg',
    'Connect 4': 'connect4.svg'
  };

  const iconFile = iconsMap[gameName] || 'tic-tac-toe.svg';
  return `/icons/${iconFile}`;
}

  constructor(private userService: User, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // 1. Get the authenticated user
    this.userService.getAuthUser().subscribe({
      next: (user) => {
        this.userId = user.id_user;
        this.name = user.name || '';
        this.nick = user.nick || '';

        this.cdr.detectChanges();
        this.loadStats();
      },
      error: (err) => {
        console.error('Error trying to get authenticated user:', err);
      }
    });
  }

  loadStats(): void {
    forkJoin({
      allGames: this.userService.getAllGames(),
      userStats: this.userService.getGameStats(this.userId),
      totals: this.userService.getTotalStats(this.userId),
      recent: this.userService.getRecentActivity(this.userId)
    }).subscribe({
      next: ({ allGames, userStats, totals, recent }) => {
        // 1. Totals
        this.totalWins = Number(totals.TotalWins || 0);
        this.totalLosses = Number(totals.TotalLosses || 0);

        this.gameStats = allGames.map(game => {
          const stat = userStats.find(s => s.GameName === game.name);
          return {
            GameName: game.name,
            Wins: stat ? Number(stat.Wins) : 0,
            Losses: stat ? Number(stat.Losses) : 0
          };
        });
        this.recentActivity = recent;
        this.cdr.detectChanges();
      }
    });
  }

  getWinPercentage(wins: number, losses: number): number {
    const total = wins + losses;
    return total === 0 ? 0 : Math.round((wins / total) * 100);
  }

  getWinLossRatio(): string {
    if (this.totalLosses === 0) {
      return this.totalWins > 0 ? this.totalWins.toFixed(2) : '0.00';
    }
    return (this.totalWins / this.totalLosses).toFixed(2);
  }

  saveChanges() {
    this.isSaving = true;
    this.errorMessage = ''; 

    this.userService.updateProfile(this.userId, { name: this.name, nick: this.nick }).subscribe({
      next: (res) => {
        alert('Profile updated successfully!');
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err.status === 422 && err.error.errors) {
          const errors = err.error.errors;
          const firstKey = Object.keys(errors)[0];
          this.errorMessage = errors[firstKey][0]; 
          alert("Nick have been tacked.");
        } else {
          this.errorMessage = err.error?.message || 'Error trying to update profile';
        }

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteAccount() {
    const confirmFirst = confirm('Are you COMPLETELY sure you want to delete your account? This action cannot be undone.');
    if (confirmFirst) {
      const confirmSecond = confirm('You will lose all your points, statistics, and wins in the leaderboard. Proceed anyway?');
      if (confirmSecond) {
        this.userService.deleteAccount(this.userId).subscribe({
          next: () => {
            alert('Your account has been deleted. Thank you for playing.');
            localStorage.removeItem('auth_token');
            window.location.reload();
          },
          error: (err) => console.error('Error deleting account', err)
        });
      }
    }
  }

}