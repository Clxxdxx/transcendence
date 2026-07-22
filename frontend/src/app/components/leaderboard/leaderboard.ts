import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../services/user';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {
  players: any[] = [];
  isLoading = true;

  constructor(private userService: User, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userService.getLeaderboard().subscribe({
      next: (data) => {
        console.log('Backend data received:', data);
        this.players = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        err.response;
        this.isLoading = false;
      }
    });
  }
}
