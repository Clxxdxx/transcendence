import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { GameCard } from './components/game-card/game-card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, GameCard],
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
}
