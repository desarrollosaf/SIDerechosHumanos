import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../interfaces/registro';
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
    this.myAPIUrl = 'api/solicitud';

  }
  


  
}
