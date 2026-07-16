import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Cell = 'R' | 'Y' | null;

const ROWS = 6;
const COLS = 7;
const CENTER_ORDER = [3, 2, 4, 1, 5, 0, 6];

@Component({
  selector: 'app-connect-four',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect-four.html',
})
export class ConnectFour {
  @Output() close = new EventEmitter<'win' | 'loss' | 'draw' | null>();

  board: Cell[][] = this.createEmptyBoard();
  columns = Array.from({ length: COLS }, (_, i) => i);
  rows = Array.from({ length: ROWS }, (_, i) => i);
  gameOver = false;

  private createEmptyBoard(): Cell[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  play(col: number) {
    if (this.gameOver) return;

    const row = this.dropDisc(col, 'R');
    if (row === -1) return;

    if (this.checkWin(row, col, 'R')) return this.finish('win');
    if (this.isBoardFull()) return this.finish('draw');

    const aiCol = this.pickAiMove();
    if (aiCol === -1) return;
    const aiRow = this.dropDisc(aiCol, 'Y');

    if (this.checkWin(aiRow, aiCol, 'Y')) return this.finish('loss');
    if (this.isBoardFull()) return this.finish('draw');
  }

  private dropDisc(col: number, player: 'R' | 'Y'): number {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!this.board[row][col]) {
        this.board[row][col] = player;
        return row;
      }
    }
    return -1;
  }

  private undoDisc(row: number, col: number) {
    this.board[row][col] = null;
  }

  private validColumns(): number[] {
    return this.columns.filter(c => !this.board[0][c]);
  }

  private isBoardFull(): boolean {
    return this.validColumns().length === 0;
  }

  private pickAiMove(): number {
    const valid = this.validColumns();
    if (valid.length === 0) return -1;

    // 1. Gana si puede
    const winCol = this.findWinningColumn('Y', valid);
    if (winCol !== -1) return winCol;

    // 2. Bloquea al jugador si puede ganar
    const blockCol = this.findWinningColumn('R', valid);
    if (blockCol !== -1) return blockCol;

    // 3. Prefiere las columnas centrales
    return CENTER_ORDER.find(c => valid.includes(c)) ?? valid[0];
  }

  private findWinningColumn(player: 'R' | 'Y', valid: number[]): number {
    for (const col of valid) {
      const row = this.dropDisc(col, player);
      const wins = this.checkWin(row, col, player);
      this.undoDisc(row, col);
      if (wins) return col;
    }
    return -1;
  }

  private checkWin(row: number, col: number, player: 'R' | 'Y'): boolean {
    const directions: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
    return directions.some(([dr, dc]) => {
      const count = 1 + this.countDirection(row, col, dr, dc, player)
                      + this.countDirection(row, col, -dr, -dc, player);
      return count >= 4;
    });
  }

  private countDirection(row: number, col: number, dr: number, dc: number, player: 'R' | 'Y'): number {
    let r = row + dr;
    let c = col + dc;
    let count = 0;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && this.board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    return count;
  }

  private finish(result: 'win' | 'loss' | 'draw') {
    this.gameOver = true;
    this.close.emit(result);
  }

  exit() {
    this.close.emit(null);
  }
}
