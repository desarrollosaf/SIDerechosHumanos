import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { UserService } from '../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-validadores',
  imports: [
    RouterLink,
    NgxDatatableModule,CommonModule,RouterModule
  ],
  templateUrl: './validadores.component.html',
  styleUrl: './validadores.component.scss'
})
export class ValidadoresComponent {
  public validadoresList: any[] = [];
  public _userService = inject(UserService);

  originalData: any[] = []; 
  temp: any[] = [];   
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  // rows = [];
  // temp = [];

  @ViewChild('table') table: DatatableComponent

  constructor() {}

  ngOnInit(): void {
    this.getValidadores()
  }

  getValidadores(){
    this._userService.getValidadores().subscribe({
    next: (response: any) => {
        this.originalData = [...response.data];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
    },
    error: (e: HttpErrorResponse) => {
    console.error('Error:', e.error?.msg || e);
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
