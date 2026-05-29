import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient){}

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
}
