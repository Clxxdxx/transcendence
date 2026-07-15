import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-arkanoid',
  standalone: true,
  templateUrl: './arkanoid.html',
})
export class Arkanoid implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() close = new EventEmitter<'win' | 'loss' | null>();

  constructor(private appRef: ApplicationRef) {}

  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private lastTime = 0;

  private readonly W = 480;
  private readonly H = 600;
  private readonly PW = 80;
  private readonly PH = 12;
  private readonly SPEED = 360; // px/s
  private readonly BALL_R = 6;
  private readonly MAX_BALL_VX = 403; // px/s

  private readonly ROWS = 5;
  private readonly COLS = 4;
  private readonly BRICK_W = 108;
  private readonly BRICK_H = 16;
  private readonly GAP = 4;
  private readonly OFFSET_TOP = 40;
  private readonly OFFSET_LEFT = (this.W - (this.COLS * (this.BRICK_W + this.GAP) - this.GAP)) / 2;
  private readonly COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa'];

  lives = 3;
  private paddleX = 0;
  private ball = { x: 0, y: 0, vx: 202, vy: -269 };
  private bricks: boolean[][] = [];
  private keys: Record<string, boolean> = {};

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => { this.keys[e.key] = false; };

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.paddleX = this.W / 2 - this.PW / 2;
    this.bricks = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(true));
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.resetBall();
    this.lastTime = performance.now();
    this.loop();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private resetBall() {
    this.ball.x = this.W / 2;
    this.ball.y = this.H - 60;
    this.ball.vx = 202 * (Math.random() < 0.5 ? 1 : -1);
    this.ball.vy = -269;
  }

  private loop = () => {
    const now = performance.now();
    // Clamp dt para evitar teletransportes/tunneling si la pestaña estuvo en pausa
    const dt = Math.min((now - this.lastTime) / 1000, 1 / 30);
    this.lastTime = now;
    this.update(dt);
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Paddle
    if ((this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) && this.paddleX > 0)
      this.paddleX -= this.SPEED * dt;
    if ((this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) && this.paddleX + this.PW < this.W)
      this.paddleX += this.SPEED * dt;

    // Bola
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Rebote paredes
    if (this.ball.x - this.BALL_R <= 0) { this.ball.x = this.BALL_R; this.ball.vx *= -1; }
    if (this.ball.x + this.BALL_R >= this.W) { this.ball.x = this.W - this.BALL_R; this.ball.vx *= -1; }
    if (this.ball.y - this.BALL_R <= 0) { this.ball.y = this.BALL_R; this.ball.vy *= -1; }

    // Rebote paddle
    const paddleY = this.H - 30;
    if (this.ball.vy > 0 &&
        this.ball.y + this.BALL_R >= paddleY &&
        this.ball.y - this.BALL_R <= paddleY + this.PH &&
        this.ball.x >= this.paddleX &&
        this.ball.x <= this.paddleX + this.PW) {
      this.ball.y = paddleY - this.BALL_R;
      this.ball.vy = -Math.abs(this.ball.vy);
      this.ball.vx += (this.ball.x - (this.paddleX + this.PW / 2)) * 10.08;
      this.ball.vx = Math.max(-this.MAX_BALL_VX, Math.min(this.MAX_BALL_VX, this.ball.vx));
    }

    // Colisión con ladrillos
    outer: for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (!this.bricks[r][c]) continue;
        const bx = this.OFFSET_LEFT + c * (this.BRICK_W + this.GAP);
        const by = this.OFFSET_TOP + r * (this.BRICK_H + this.GAP);
        if (this.ball.x + this.BALL_R >= bx && this.ball.x - this.BALL_R <= bx + this.BRICK_W &&
            this.ball.y + this.BALL_R >= by && this.ball.y - this.BALL_R <= by + this.BRICK_H) {
          this.bricks[r][c] = false;
          this.ball.vy *= -1;
          break outer;
        }
      }
    }

    // Victoria
    if (this.bricks.every(row => row.every(b => !b))) {
      cancelAnimationFrame(this.animationId);
      this.close.emit('win');
      this.appRef.tick();
      return;
    }

    // Bola perdida
    if (this.ball.y - this.BALL_R > this.H) {
      this.lives--;
      if (this.lives <= 0) {
        cancelAnimationFrame(this.animationId);
        this.close.emit('loss');
        this.appRef.tick();
        return;
      }
      this.resetBall();
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.W, this.H);

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (!this.bricks[r][c]) continue;
        ctx.fillStyle = this.COLORS[r % this.COLORS.length];
        ctx.fillRect(
          this.OFFSET_LEFT + c * (this.BRICK_W + this.GAP),
          this.OFFSET_TOP + r * (this.BRICK_H + this.GAP),
          this.BRICK_W, this.BRICK_H,
        );
      }
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(this.paddleX, this.H - 30, this.PW, this.PH);

    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.BALL_R, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Vidas: ${this.lives}`, 10, 20);
  }

  exit() {
    cancelAnimationFrame(this.animationId);
    this.close.emit(null);
  }
}
