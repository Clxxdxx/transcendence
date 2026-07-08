import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Cell = 'X' | 'O' | null;

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tic-tac-toe.html',
})
export class TicTacToe {
  @Output() close = new EventEmitter<'win' | 'loss' | 'draw' | null>();

  board: Cell[] = Array(9).fill(null);
  gameOver = false;
  message = '';
  private aiMoveCount = 0;

  play(index: number) {
    if (this.gameOver || this.board[index]) return;

    this.board[index] = 'X';
    if (this.checkEnd('X')) return;

    const aiMove = this.pickAiMove();
    if (aiMove === -1) return;
    this.board[aiMove] = 'O';
    this.aiMoveCount++;
    this.checkEnd('O');
  }

  private pickAiMove(): number {
    const empty = this.board
      .map((cell, i) => (cell === null ? i : -1))
      .filter(i => i !== -1);
    if (empty.length === 0) return -1;

    // Uno de cada dos movimientos es aleatorio (IA "tonta" a ratos)
    const isSmartTurn = this.aiMoveCount % 2 === 1;
    if (!isSmartTurn) {
      return empty[Math.floor(Math.random() * empty.length)];
    }

    // 1. Gana si puede
    const winMove = this.findWinningMove('O', empty);
    if (winMove !== -1) return winMove;

    // 2. Bloquea al jugador si puede ganar
    const blockMove = this.findWinningMove('X', empty);
    if (blockMove !== -1) return blockMove;

    // 3. Prefiere el centro
    if (empty.includes(4)) return 4;

    // 4. Prefiere una esquina
    const corners = [0, 2, 6, 8].filter(i => empty.includes(i));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    // 5. Cualquier casilla libre
    return empty[Math.floor(Math.random() * empty.length)];
  }

  private findWinningMove(player: 'X' | 'O', empty: number[]): number {
    for (const line of WIN_LINES) {
      const values = line.map(i => this.board[i]);
      const playerCount = values.filter(v => v === player).length;
      const emptyIndex = line.find(i => this.board[i] === null);
      if (playerCount === 2 && emptyIndex !== undefined && empty.includes(emptyIndex)) {
        return emptyIndex;
      }
    }
    return -1;
  }

  private checkEnd(lastPlayer: 'X' | 'O'): boolean {
    if (WIN_LINES.some(line => line.every(i => this.board[i] === lastPlayer))) {
      this.gameOver = true;
      this.message = lastPlayer === 'X' ? '¡Has ganado!' : 'La IA ha ganado';
      return true;
    }
    if (this.board.every(cell => cell !== null)) {
      this.gameOver = true;
      this.message = 'Empate';
      return true;
    }
    return false;
  }

  restart() {
    this.board = Array(9).fill(null);
    this.gameOver = false;
    this.message = '';
    this.aiMoveCount = 0;
  }

  exit() {
    if (!this.gameOver) {
      this.close.emit(null);
      return;
    }
    if (this.message === '¡Has ganado!') this.close.emit('win');
    else if (this.message === 'La IA ha ganado') this.close.emit('loss');
    else this.close.emit('draw');
  }
}
