import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'https://localhost/api';
  private tokenKey = 'auth_token';
  private email = 'email';
  private id = 'id_user';
  private nick = 'nick';

  constructor(private http: HttpClient){}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, 
      { email, password }, 
      { headers }
    );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setEmail(mail: string): void {
    localStorage.setItem(this.email, mail);
    
  }

  setId(id_user: string): void {
    localStorage.setItem(this.id, id_user)
  }

  setNick(nickname: string): void {
    localStorage.setItem(this.nick, nickname)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.email);
  }

  getId(): string | null {
    return localStorage.getItem(this.id);
  }

  getNick(): string | null {
    return localStorage.getItem(this.nick);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.email);
    localStorage.removeItem(this.id);
    localStorage.removeItem(this.nick);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
