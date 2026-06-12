import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importamos ChangeDetectorRef
import { User } from '../../services/user';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-top-players',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './top-players.html',
  styleUrl: './top-players.css',
})
export class TopPlayers implements OnInit {
  @Output() viewLeaderboard = new EventEmitter<void>();
  players: any[] = [];
  isLoading = true;

  constructor( private userService: User, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.loadTopPlayers();
  }

  loadTopPlayers() {
    this.isLoading = true;
    
    this.userService.getLeaderboard().subscribe({
      next: (data: any[]) => {
        this.players = data ? [...data.slice(0, 7)] : [];
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.players = [];
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  onViewLeaderboard() {
    this.viewLeaderboard.emit();
  }
}