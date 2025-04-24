import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Injectable, signal, inject, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServidoresService {
  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'
    this.myAPIUrl = 'api/servidor';

  }
  
  getUser(): Observable<User[]> {
    console.log(`${this.myAppUrl}${this.myAPIUrl}/read`, );
    return this.http.get<User[]>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }
  
}
