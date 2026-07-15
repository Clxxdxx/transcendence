import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Email {
  private apiUrl = '/api';

  constructor(private http: HttpClient){}

  sendCode(email: string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-type': 'application/json'});
    return this.http.post(`${this.apiUrl}/send-recovery-code`, { email }, { headers })
  }

  verifyCode(email: string, code: string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-type': 'application/json'});
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code }, { headers })
  } 

}
