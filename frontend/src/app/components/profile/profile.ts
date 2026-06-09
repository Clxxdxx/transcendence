import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user';
import { forkJoin } from 'rxjs'; // 1. Importamos forkJoin para controlar el flujo asíncrono

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  userId!: number;

  // Datos del formulario
  name: string = '';
  nick: string = '';

  // Estadísticas reales del backend
  totalWins: number = 0;
  totalLosses: number = 0;
  gameStats: any[] = [];

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

  const iconFile = iconsMap[gameName] || 'tic-tac-toe.svg'; // Icono por defecto si no encuentra coincidencia
  return `/icons/${iconFile}`;
}

  constructor(private userService: User, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // 1. Obtenemos el usuario autenticado
    this.userService.getAuthUser().subscribe({
      next: (user) => {
        this.userId = user.id_user;
        this.name = user.name || '';
        this.nick = user.nick || '';

        // 2. Ejecutamos la carga de estadísticas pasándole los datos
        this.loadStats();
      },
      error: (err) => {
        console.error('Error al obtener usuario autenticado:', err);
      }
    });
  }

  loadStats(): void {
    forkJoin({
      allGames: this.userService.getAllGames(), // Necesitas este endpoint en tu service
      userStats: this.userService.getGameStats(this.userId),
      totals: this.userService.getTotalStats(this.userId)
    }).subscribe({
      next: ({ allGames, userStats, totals }) => {
        // 1. Totales
        this.totalWins = Number(totals.TotalWins || 0);
        this.totalLosses = Number(totals.TotalLosses || 0);

        // 2. Cruce de datos: Mostrar todos los juegos, con 0 si no hay stats
        this.gameStats = allGames.map(game => {
          const stat = userStats.find(s => s.GameName === game.name);
          return {
            GameName: game.name,
            Wins: stat ? Number(stat.Wins) : 0,
            Losses: stat ? Number(stat.Losses) : 0
          };
        });
        
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
    this.userService.updateProfile(this.userId, { name: this.name, nick: this.nick }).subscribe({
      next: (res) => {
        alert('¡Perfil actualizado con éxito!');
        this.isSaving = false;
        this.cdr.detectChanges(); // Mantenemos la vista fresca al guardar
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error al actualizar el perfil');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteAccount() {
    const confirmFirst = confirm('⚠️ ¿Estás COMPLETAMENTE seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmFirst) {
      const confirmSecond = confirm('🔥 Perderás todos tus puntos, estadísticas y victorias en la clasificación. ¿Proceder de todos modos?');
      if (confirmSecond) {
        this.userService.deleteAccount(this.userId).subscribe({
          next: () => {
            alert('Tu cuenta ha sido eliminada. Gracias por jugar.');
            localStorage.removeItem('auth_token');
            window.location.reload();
          },
          error: (err) => console.error('Error al borrar la cuenta', err)
        });
      }
    }
  }

}