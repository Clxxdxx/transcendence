import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-pong',
  standalone: true,
  templateUrl: './pong.html',
})
export class Pong implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() close = new EventEmitter<'win' | 'loss' | null>();

  constructor(private appRef: ApplicationRef) {}

  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private lastTime = 0;

  private readonly W = 800;
  private readonly H = 500;
  private readonly PW = 10;
  private readonly PH = 80;
  private readonly SPEED = 240; // px/s
  private readonly BW = 10;
  private readonly BH = 10;
  private readonly WIN_SCORE = 5;
  private readonly MAX_BALL_VX = 806; // px/s
  private readonly MAX_BALL_VY = 672; // px/s

  private playerScore = 0;
  private aiScore = 0;
  private player = { x: 20, y: 0 };
  private ai = { x: 0, y: 0 };
  private ball = { x: 0, y: 0, vx: 269, vy: 202 };
  private keys: Record<string, boolean> = {};

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key] = true;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => { this.keys[e.key] = false; };

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.player.y = this.H / 2 - this.PH / 2;
    this.ai.x = this.W - 30;
    this.ai.y = this.H / 2 - this.PH / 2;
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
    this.ball.y = this.H / 2;
    this.ball.vx = 269 * (Math.random() < 0.5 ? 1 : -1);
    this.ball.vy = (Math.random() * 134 + 134) * (Math.random() < 0.5 ? 1 : -1);
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
    // Paddle jugador
    if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) && this.player.y > 0)
      this.player.y -= this.SPEED * dt;
    if ((this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) && this.player.y + this.PH < this.H)
      this.player.y += this.SPEED * dt;

    // Paddle IA — mismo speed que el jugador, sigue el centro de la bola
    const aiMid = this.ai.y + this.PH / 2;
    if (aiMid < this.ball.y - 4 && this.ai.y + this.PH < this.H)
      this.ai.y += this.SPEED * dt;
    else if (aiMid > this.ball.y + 4 && this.ai.y > 0)
      this.ai.y -= this.SPEED * dt;

    // Mover bola
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Rebote paredes top/bottom
    if (this.ball.y <= 0) { this.ball.y = 0; this.ball.vy *= -1; }
    if (this.ball.y + this.BH >= this.H) { this.ball.y = this.H - this.BH; this.ball.vy *= -1; }

    // Rebote paddle jugador (solo cuando la bola va hacia la izquierda)
    if (this.ball.vx < 0 &&
        this.ball.x <= this.player.x + this.PW &&
        this.ball.x >= this.player.x &&
        this.ball.y + this.BH >= this.player.y &&
        this.ball.y <= this.player.y + this.PH) {
      this.ball.x = this.player.x + this.PW;
      this.ball.vx = Math.min(Math.abs(this.ball.vx) * 1.05, this.MAX_BALL_VX);
      this.ball.vy += (this.ball.y + this.BH / 2 - (this.player.y + this.PH / 2)) * 6.72;
      this.ball.vy = Math.max(-this.MAX_BALL_VY, Math.min(this.MAX_BALL_VY, this.ball.vy));
    }

    // Rebote paddle IA (solo cuando la bola va hacia la derecha)
    if (this.ball.vx > 0 &&
        this.ball.x + this.BW >= this.ai.x &&
        this.ball.x <= this.ai.x + this.PW &&
        this.ball.y + this.BH >= this.ai.y &&
        this.ball.y <= this.ai.y + this.PH) {
      this.ball.x = this.ai.x - this.BW;
      this.ball.vx = -Math.min(Math.abs(this.ball.vx) * 1.05, this.MAX_BALL_VX);
      this.ball.vy += (this.ball.y + this.BH / 2 - (this.ai.y + this.PH / 2)) * 6.72;
      this.ball.vy = Math.max(-this.MAX_BALL_VY, Math.min(this.MAX_BALL_VY, this.ball.vy));
    }

    // Gol izquierda → punto para la IA
    if (this.ball.x + this.BW < 0) {
      this.aiScore++;
      if (this.aiScore >= this.WIN_SCORE) {
        cancelAnimationFrame(this.animationId);
        this.draw();
        this.close.emit('loss');
        this.appRef.tick();
        return;
      }
      this.resetBall();
    }

    // Gol derecha → punto para el jugador
    if (this.ball.x > this.W) {
      this.playerScore++;
      if (this.playerScore >= this.WIN_SCORE) {
        cancelAnimationFrame(this.animationId);
        this.draw();
        this.close.emit('win');
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

    // Línea central punteada
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.W / 2, 0);
    ctx.lineTo(this.W / 2, this.H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles y bola
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.player.x, this.player.y, this.PW, this.PH);
    ctx.fillRect(this.ai.x, this.ai.y, this.PW, this.PH);
    ctx.fillRect(this.ball.x, this.ball.y, this.BW, this.BH);

    // Marcador
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(String(this.playerScore), this.W / 4, 60);
    ctx.fillText(String(this.aiScore), (this.W * 3) / 4, 60);
  }

  exit() {
    cancelAnimationFrame(this.animationId);
    this.close.emit(null);
  }
}
