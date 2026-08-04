import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ConvocatoriaService } from '../../../service/convocatoria.service';
import { Convocatoria } from '../../../interfaces/convocatoria';

@Component({
  selector: 'app-convocatorias',
  imports: [CommonModule, RouterModule],
  templateUrl: './convocatorias.component.html',
  styleUrl: './convocatorias.component.scss'
})
export class ConvocatoriasComponent {

  public _convocatoriaService = inject(ConvocatoriaService);

  convocatorias: Convocatoria[] = [];
  cargando = true;

  ngOnInit(): void {
    this._convocatoriaService.getConvocatorias().subscribe({
      next: (respuesta) => {
        this.convocatorias = respuesta.data;
        this.cargando = false;
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al obtener las convocatorias:', e.error?.msg || e);
        this.cargando = false;
      },
    });
  }
}
