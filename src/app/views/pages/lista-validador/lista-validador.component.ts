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
  public _validadorService = inject(ValidadorService);
  @ViewChild('table') table: DatatableComponent;


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.rutaActual = this.router.url;
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

    const payload: any = {};
    if (this._userService.currentUserValue?.id !== undefined) {
      payload.usuario = this._userService.currentUserValue.id;
    }
    if (typeof this.tipoEstatus !== 'undefined') {
      payload.id = this.tipoEstatus;
    }
    
    this._validadorService.getSolicitudes(payload).subscribe({
      next: (response: any) => {
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
