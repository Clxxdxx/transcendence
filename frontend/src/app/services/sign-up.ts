import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignUp {
  private apiUrl = '/api';

  constructor(private http: HttpClient){}

  signUp(name: string, email: string, nick: string,  password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/users`, 
      { name, email, nick, password }, 
      { headers }
    );
  }

}
