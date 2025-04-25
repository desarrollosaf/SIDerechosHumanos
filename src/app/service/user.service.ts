import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Injectable, signal, inject, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'
    this.myAPIUrl = 'api/user';

  }
  
  getUser(): Observable<User[]> {
    console.log(`${this.myAppUrl}${this.myAPIUrl}/read`, );
    return this.http.get<User[]>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }

  signIn(user: User): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/register`, user);
  }
  login(user: User): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/login`, user);
  }
  
}
