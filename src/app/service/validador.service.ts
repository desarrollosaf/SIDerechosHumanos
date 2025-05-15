import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../interfaces/documento';
import { Injectable, signal, inject, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'
    this.myAPIUrl = 'api/solicitud';

  }

  getSolicitudes(id : Number): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/getsolicitudes/${id}`)
  }
}
