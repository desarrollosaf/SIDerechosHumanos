import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Convocatoria } from '../interfaces/convocatoria';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );

  constructor() {
    this.myAppUrl = 'http://localhost:3001/'; //'https://dev4.siasaf.gob.mx/'  //'http://localhost:3001/'
    this.myAPIUrl = 'api/convocatorias';
  }

  /** Convocatorias activas, para el listado público. */
  getConvocatorias(): Observable<{ msg: string, data: Convocatoria[] }> {
    return this.http.get<{ msg: string, data: Convocatoria[] }>(`${this.myAppUrl}${this.myAPIUrl}`)
  }

  /** Detalle con requisitos y documentos de una convocatoria. */
  getConvocatoria(slug: string): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.myAppUrl}${this.myAPIUrl}/${slug}`)
  }

}
