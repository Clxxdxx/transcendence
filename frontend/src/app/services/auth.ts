import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'auth_token';
  private email = 'email';

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

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.email);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.email);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
