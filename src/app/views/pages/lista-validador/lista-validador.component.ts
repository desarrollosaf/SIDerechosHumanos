import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorService } from '../../../service/validador.service';
import { UserService } from '../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-lista-validador',
  imports: [NgxDatatableModule, CommonModule,RouterModule],
  templateUrl: './lista-validador.component.html',
  styleUrl: './lista-validador.component.scss'
})
export class ListaValidadorComponent {
  originalData: any[] = []; 
  temp: any[] = [];   
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  rutaActual: string = '';
  titulo: string = '';
  tipoEstatus: number = 0;
  public _userService = inject(UserService);
  public _solicitudesService = inject(ValidadorService);
  @ViewChild('table') table: DatatableComponent;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rutaActual = this.router.url;
    console.log('Ruta actual:', this.rutaActual);
    if (this.rutaActual.includes('tramite')) {
      this.titulo='Solicitudes en tramite'
      this.tipoEstatus = 2;
    } else if (this.rutaActual.includes('finalizados')) {
      this.titulo='Solicitudes finalizadas'
      this.tipoEstatus = 3;
    }else if(this.rutaActual.includes('rechazados')){
      this.titulo='Solicitudes rechazadas'
      this.tipoEstatus = 4;
    }

    const formData = new FormData();
    
    formData.append('usuario', String(this._userService.currentUserValue?.id));
    formData.append('id', String(this.tipoEstatus));
    console.log( String(this.tipoEstatus));
    this._solicitudesService.getSolicitudes(formData).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.originalData = [...response.data];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        const msg = e.error?.msg || 'Error desconocido';
        console.error('Error del servidor:', msg);
      }
    });
  }

  setPage(pageInfo: any) {
    this.page = pageInfo.offset;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.temp.slice(start, end); 
  }

updateFilter(event: any) {
  const val = (event.target?.value || '').toLowerCase();

  this.temp = this.originalData.filter((row: any) => {
    return Object.values(row).some((field) => {
      return field && field.toString().toLowerCase().includes(val);
    });
  });

  this.filteredCount = this.temp.length;
  this.setPage({ offset: 0 }); 
}
}
