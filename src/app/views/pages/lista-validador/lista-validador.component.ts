import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorService } from '../../../service/validador.service';
import { UserService } from '../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
@Component({
  selector: 'app-lista-validador',
  imports: [NgxDatatableModule,CommonModule],
  templateUrl: './lista-validador.component.html',
  styleUrl: './lista-validador.component.scss'
})
export class ListaValidadorComponent {
  rows: any[] = [];
  loading: boolean = true;
  rutaActual: string = '';
  public _userService = inject(UserService);
  public _solicitudesService = inject(ValidadorService);
  constructor(private router: Router) {}

    ngOnInit(): void {
    this.rutaActual = this.router.url;
    console.log('Ruta actual:', this.rutaActual);


    this._solicitudesService.getSolicitudes().subscribe({
      next: (response: any) => {
        console.log(response);
         console.log(response);
        this.rows = response.data;
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
        console.error('Error del servidor:', e.error.msg);
      } else {
        console.error('Error desconocido:', e);
      }
      },
    })




    if (this.rutaActual.includes('tramite')) {
      
    } else if (this.rutaActual.includes('finalizados')) {
      
    }
  }




}
