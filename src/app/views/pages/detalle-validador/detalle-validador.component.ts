import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../service/documento.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detalle-validador',
  imports: [CommonModule],
  templateUrl: './detalle-validador.component.html',
  styleUrl: './detalle-validador.component.scss'
})
  export class DetalleValidadorComponent {
    id:number;
    public _documentoService = inject(DocumentoService);
    archivosSubidos: { [key: string]: string } = {};
    documentos: any;
    constructor(private aRouter: ActivatedRoute) {
      this.id = Number(aRouter.snapshot.paramMap.get('id'));
    }

    ngOnInit(): void {
      console.log(this.id)
       this.getDocumUsuario();
    }

    getDocumUsuario() {
      this._documentoService.getDocumentosUser(this.id).subscribe({
        next: (response: any) => {
          console.log(response);
          console.log(response.estatusId);
          this.documentos = response.documentos;
          this.documentos.forEach((doc: any) => {
            if (doc) {
              const archivoUrl = 'http://localhost:3001/' + doc.path;
              this.archivosSubidos[doc.tipo?.valor] = archivoUrl;
       
            }
          });  
      
        },
        error: (e: HttpErrorResponse) => {
          if (e.error && e.error.msg) {
            console.error('Error del servidor:', e.error.msg);
          } else {
            console.error('Error desconocido:', e);
          }
        },
      })
    }
}
