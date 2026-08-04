import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../../service/documento.service';
import { ValidadorService } from '../../../../service/validador.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Convocatoria } from '../../../../interfaces/convocatoria';
@Component({
  selector: 'app-detalle-validador',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule, MatIconModule, RouterModule, NgSelectModule, NgbAlertModule],
  templateUrl: './detalle-validador.component.html',
  styleUrl: './detalle-validador.component.scss'
})
export class DetalleValidadorComponent {
  id: string;
  isLoading: boolean = false;
  public _documentoService = inject(DocumentoService);
  public _validadorService = inject(ValidadorService);
  public _userService = inject(UserService);


  archivosSubidos: { [key: string]: string } = {};
  documentos: any;
  solicitante: any;
  validadorSol: any;
  estatusSoli: any;
  idSolid: any;
  esValidador2 = false;
  validEm: any;
  public currentUser: any;
  public esAdmin: boolean = false;
  public esValidador: boolean = false;
  public usuariosValidador: any[] = [];
  validadorSeleccionado: string = '';
  /** Convocatoria de la solicitud que se está revisando. */
  convocatoria: Convocatoria | null = null;

  /** Documentos a revisar; se arman con los que pide la convocatoria. */
  documentosRequeridos: {
    clave: string;
    label: string;
    txt: string;
    estatus?: number;
    observaciones?: number;
  }[] = [];

  validarrechazar: {
    [key: string]: {
      estado: true | false,
      observaciones: string
      estadoOriginal?: boolean;
    }
  } = {};

  constructor(private aRouter: ActivatedRoute, private router: Router) {
    this.id = String(aRouter.snapshot.paramMap.get('id'));
    this.currentUser = this._userService.currentUserValue;
    this.esAdmin = this.currentUser.rol_users?.role?.name === 'Administrador';
    this.esValidador = this.currentUser.rol_users?.role?.name === 'Validador';
  }

  ngOnInit(): void {
    this.getDocumUsuario();
    this.validEm = this._userService.currentUserValue?.email;
    if(this.validEm == 'validador2@congresoedomex.gob.mx'){
      this.esValidador2 = true;
    }
  }

  obtenerValidadores() {
    this._userService.getValidadores().subscribe({
      next: (response: any) => {
        this.usuariosValidador = response.data;
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
      }
    });
  }

  reasignarValidador(usuario: any) {

    const idSolicitud = this.solicitante.documentos[0]?.solicitudId;
    const id = usuario?.id;
    if (id) {
      const datos = {
        usuario: id, solicitud: idSolicitud
      };
      this._userService.reasignarValidador(datos).subscribe({
        next: (response: any) => {
          const valida = usuario?.datos_user?.nombre + ' ' + usuario?.datos_user?.apaterno + ' ' + usuario?.datos_user?.amaterno;
          this.validadorSol = valida;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'La solicitud ha sido reasignada.',
            showConfirmButton: false,
            timer: 2000
          });
          this.validadorSeleccionado = '';
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error:', e.error?.msg || e);
        }
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Debe seleccionar un validador.',
        showConfirmButton: false,
        timer: 2000
      });
    }

  }

  getDocumUsuario() {
    this._documentoService.getDocumentosUser(this.id).subscribe({
      next: (response: any) => {
        this.validadorSol = response.validasolicitud.validador.datos_user.nombre + ' ' + response.validasolicitud.validador.datos_user.apaterno + ' ' + response.validasolicitud.validador.datos_user.amaterno;
        this.solicitante = response;
        // console.log(this.solicitante.curp);
        this.idSolid = response.id;
        this.documentos = response.documentos;
        this.estatusSoli = response.estatusId;

        this.convocatoria = response.convocatoria ?? null;
        this.armarDocumentosRequeridos();

        this.documentos.forEach((doc: any) => {
          const clave = doc.tipo?.valor;
          const archivoUrl = 'https://dev4.siasaf.gob.mx/' + doc.path;
          this.archivosSubidos[clave] = archivoUrl;
          const index = this.documentosRequeridos.findIndex(d => d.clave === clave);
          if (index !== -1) {
            this.documentosRequeridos[index].estatus = doc.estatus;
          }
          if (doc.estatus == 2) {
            this.validarrechazar[clave] = {
              estado: doc.estatus === 2,
              observaciones: doc.observaciones || '',
              estadoOriginal: doc.estatus === 2,
            };
          } else {
            this.validarrechazar[clave] = {
              estado: doc.estatus === 1,
              observaciones: doc.observaciones || '',
              estadoOriginal: doc.estatus === 1,
            };
          }

        });

        if (this.esAdmin) {
          this.obtenerValidadores();
        }
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
      }
    });
  }


  /** Cada convocatoria pide sus propios documentos, así que la lista a revisar
   *  se construye con los tipos que trae la solicitud. */
  private armarDocumentosRequeridos(): void {
    const tipos = (this.convocatoria?.tipos_documento ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden);

    this.documentosRequeridos = tipos.map((tipo) => ({
      clave: tipo.valor,
      label: tipo.requisito ?? '',
      txt: tipo.documento_requerido
        ? `Documento requerido: ${tipo.documento_requerido}${tipo.obligatorio ? '*' : ''}:`
        : '',
    }));

    this.validarrechazar = {};
    tipos.forEach((tipo) => {
      this.validarrechazar[tipo.valor] = { estado: true, observaciones: '' };
    });
  }

  onToggleChange(clave: string) {
    const estadoActual = this.validarrechazar[clave].estado;
    if (estadoActual === true) {
      this.validarrechazar[clave].observaciones = '';
    }

  }

  enviarValidacion(): void {
    const documentosArray = Object.entries(this.validarrechazar)
      .filter(([_, datos]) => datos.estado === false)
      .map(([nombre, datos]) => ({
        nombre,
        estado: datos.estado,
        observaciones: datos.observaciones
      }));

    // if (documentosArray.length === 0) {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Sin documentos rechazados',
    //     text: 'No hay documentos rechazados para enviar.',
    //     confirmButtonText: 'Aceptar'
    //   });
    //   return;
    // }
    this._documentoService.sendValidacion(documentosArray, this.id).subscribe({
      next: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Proceso concluido: La validación de la información remitida por el candidato se ha completado exitosamente.',
          showConfirmButton: false,
          timer: 3000
        });
        this.router.navigate(['/solicitud/tramite']);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al enviar validación:', e.error?.msg || e);
      }
    });
  }

  exportarZip(): void {
    this._documentoService.getDocsZip(this.idSolid).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `documentos_${this.solicitante.curp}.zip`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al enviar validación:', e.error?.msg || e);
      }
    });
  }

}
