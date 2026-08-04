import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidadorService } from '../../../service/validador.service';
import { UserService } from '../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-lista-validador',
  imports: [NgxDatatableModule, CommonModule, RouterModule],
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
  /** Convocatorias presentes en los datos cargados, para el filtro por pestañas. */
  convocatorias: { slug: string, nombre: string }[] = [];
  /** Slug seleccionado en el filtro; '' = todas. */
  convocatoriaSeleccionada: string = '';
  private textoBusqueda: string = '';
  public _userService = inject(UserService);
  public _validadorService = inject(ValidadorService);
  @ViewChild('table') table: DatatableComponent;


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.rutaActual = this.router.url;
    if (this.rutaActual.includes('tramite')) {
      this.titulo = 'Solicitudes en tramite'
      this.tipoEstatus = 2;

    } else if (this.rutaActual.includes('finalizados')) {
      this.titulo = 'Solicitudes finalizadas'
      this.tipoEstatus = 3;

    } else if (this.rutaActual.includes('rechazados')) {
      this.titulo = 'Solicitudes rechazadas'
      this.tipoEstatus = 4;
    }else if(this.rutaActual.includes('registradas')){
      this.titulo='Solicitudes registradas'
      this.tipoEstatus = 5;
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
        this.convocatorias = this.extraerConvocatorias(this.originalData);
        this.aplicarFiltros();
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

  onSort(event: any) {
    const sort = event.sorts[0];
    const prop = sort.prop;
    const dir = sort.dir;

    this.temp.sort((a, b) => {
      let valA: any, valB: any;

      if (prop === 'nombreCompleto') {
        valA = `${a.ap_paterno} ${a.ap_materno} ${a.nombres}`.toLowerCase();
        valB = `${b.ap_paterno} ${b.ap_materno} ${b.nombres}`.toLowerCase();
      } else if (prop === 'convocatoria') {
        valA = (a.convocatoria?.nombre || '').toLowerCase();
        valB = (b.convocatoria?.nombre || '').toLowerCase();
      } else if (prop === 'fecha_envio') {
        valA = new Date(a.fecha_envio || a.createdAt).getTime();
        valB = new Date(b.fecha_envio || b.createdAt).getTime();
      } else {
        valA = a[prop];
        valB = b[prop];
      }

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        return dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return dir === 'asc' ? valA - valB : valB - valA;
    });

    this.setPage({ offset: 0 }); // Vuelve a mostrar la primera página
  }

  
  updateFilter(event: any) {
    this.textoBusqueda = (event.target?.value || '').toLowerCase();
    this.aplicarFiltros();
  }

  filtrarPorConvocatoria(slug: string) {
    this.convocatoriaSeleccionada = slug;
    this.aplicarFiltros();
  }

  /** Lista única de convocatorias presentes en los datos, para las pestañas del filtro. */
  private extraerConvocatorias(data: any[]): { slug: string, nombre: string }[] {
    const vistos = new Map<string, string>();
    data.forEach((row) => {
      if (row.convocatoria?.slug && !vistos.has(row.convocatoria.slug)) {
        vistos.set(row.convocatoria.slug, row.convocatoria.nombre);
      }
    });
    return Array.from(vistos, ([slug, nombre]) => ({ slug, nombre }));
  }

  private aplicarFiltros() {
    const val = this.textoBusqueda;

    this.temp = this.originalData.filter((row: any) => {
      if (this.convocatoriaSeleccionada && row.convocatoria?.slug !== this.convocatoriaSeleccionada) {
        return false;
      }
      if (!val) {
        return true;
      }
      if ((row.convocatoria?.nombre || '').toLowerCase().includes(val)) {
        return true;
      }
      return Object.values(row).some((field) => {
        return field && field.toString().toLowerCase().includes(val);
      });
    });

    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }

  exportToExcel(): void {
    const exportData = this.temp.map((row, index) => ({
      N: index + 1,
      'Fecha Solicitud': this.formatDate(row.fecha_envio || row.createdAt),
      Folio: row.id?.substring(0, 8),
      Convocatoria: row.convocatoria?.nombre ?? '',
      Nombre: `${row.ap_paterno} ${row.ap_materno} ${row.nombres}`,
      Correo: row.correo,
      Telefono: row.celular,
      Curp: row.curp,
      Estatus: this.getEstatusNombre(row.estatusId)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Datos': worksheet },
      SheetNames: ['Datos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'reporte.xlsx');
  }

  // Devuelve el nombre del estatus como texto
  getEstatusNombre(estatusId: number): string {
    switch (estatusId) {
      case 1: return 'Registrado';
      case 2: return 'Pendiente';
      case 3: return 'Validado';
      case 4: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

getLink(row: any): string[] {
  if (this._userService.currentUserValue?.rol_users?.role?.name == 'Administrador' && this.rutaActual.includes('registradas')) {
    return ['/registro/add-documentos', row.userId];
  }
    return ['/solicitud/validacion', row.userId]; 
}


  formatDate(fecha: string | Date): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return ''; // fecha inválida
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
