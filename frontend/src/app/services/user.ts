import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = '/api';
  constructor(private http: HttpClient){}

  getAuthUser(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  getUser(id: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/users/${id}`)
  }

  getIdByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/by-email/${email}`);
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/users/${userId}/password`, null, {
          params: { password: newPassword }
      });
  }

  getLeaderboard(): Observable<any[]> {
    const token = localStorage.getItem('auth_token'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/users/leaderboard`, { headers });
  }

  updateProfile(id: number, data: { name: string, nick: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getGameStats(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/stats`);
  }

  getTotalStats(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}/stats/totals`);
  }

  getAllGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games`);
  }

  getRecentActivity(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/recentActivity/${id}`);
  }

  addPoints(id: number, points: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/users/${id}/add-points`, { points }, { headers });
  }
}

