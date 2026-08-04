import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Documento } from '../../../../interfaces/documento';
import { Convocatoria, TipoDocumento } from '../../../../interfaces/convocatoria';
import { UserService } from '../../../../service/user.service';
import { DocumentoService } from '../../../../service/documento.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-documentos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-edit-documentos.component.html',
  styleUrl: './add-edit-documentos.component.scss'
})

export class AddEditDocumentosComponent {
  @ViewChildren('fileInputsRef') fileInputsRef!: QueryList<ElementRef<HTMLInputElement>>;
  formDoc: FormGroup;
  files: { [key: string]: File } = {};
  public _userService = inject(UserService);
  public _documentoService = inject(DocumentoService);
  archivosSubidos: { [key: string]: string } = {};
  archivosRechazados: { [key: string]: number } = {};
  observac: { [key: string]: string } = {};
  documentos: any;
  isLoading: boolean = false;
  estatusSoli: any;
  isAdmin = false;
  id_user: string | null = null;
  data: any  = {};

  /** Convocatoria de la solicitud; define qué documentos se piden. */
  convocatoria: Convocatoria | null = null;
  /** Tipos de documento de la convocatoria, en orden de despliegue. */
  tipos: TipoDocumento[] = [];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,) {
    // Los controles se agregan al conocer la convocatoria de la solicitud.
    this.formDoc = this.fb.group({});
  }

  ngOnInit(): void {
    this.getDocumUsuario();
  }

  /** Una solicitud ya validada solo se consulta, no se modifica. */
  get soloLectura(): boolean {
    return this.estatusSoli === 3;
  }

  /** Documentos que ya tienen un archivo cargado, para la barra de progreso. */
  get documentosCompletados(): number {
    return this.tipos.filter(t => !!this.archivosSubidos[t.valor]).length;
  }

  get progresoPorcentaje(): number {
    return this.tipos.length
      ? Math.round((this.documentosCompletados / this.tipos.length) * 100)
      : 0;
  }

  /** Estado visual de cada tarjeta: pendiente, cargado o rechazado. */
  estadoDocumento(valor: string): 'pendiente' | 'cargado' | 'rechazado' {
    if (this.archivosRechazados[valor] === 3) return 'rechazado';
    if (this.archivosSubidos[valor]) return 'cargado';
    return 'pendiente';
  }

  /**
   * Los documentos aprobados (estatus 2) dejan de mostrarse; los pendientes
   * y los observados siguen visibles para poder subsanarlos.
   */
  mostrarDocumento(valor: string): boolean {
    const estatus = this.archivosRechazados[valor];
    return !estatus || estatus === 1 || estatus === 3;
  }

  eliminarArchivo(tipoDoc: string){
    const currntUsr = String(this.id_user);
      const datos = {
        tipo: tipoDoc, usuario: currntUsr
      };
      this._documentoService.deleteDocumento(datos).subscribe({
        next: (response: any) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Documento borrado correctamente."
          });
          this.archivosSubidos[tipoDoc] = '';
          const control = this.formDoc.get(tipoDoc);
          const tipo = this.tipos.find(t => t.valor === tipoDoc);
          if (control) {
          control.reset();
          if (tipo?.obligatorio !== false) {
            control.setValidators([Validators.required]);
          }
          control.updateValueAndValidity();
          }
          const input = document.getElementById(tipoDoc) as HTMLInputElement;
          if (input) {
            input.value = '';
          }

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
  onFile7(event: Event, controlName: string, maxmb: number): void {

    const input = event.target as HTMLInputElement;
    const control = this.formDoc.get(controlName);
    const currntUsr = String(this.id_user);

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = maxmb * 1024 * 1024;

      if (file.size > maxSize) {
        control?.setErrors({ fileSize: true });
      }else{
        control?.setErrors(null);
        this.files[controlName] = file;

        const formData = new FormData();
        formData.append('tipo', controlName);
        formData.append('archivo', this.files[controlName]);
        formData.append('usuario', String(currntUsr));

        this._documentoService.saveDocumentos(formData, currntUsr).subscribe({
          next: (response: any) => {
            const archivoUrl = 'https://dev4.siasaf.gob.mx/' + response.documento.path;
            this.archivosSubidos[controlName] = archivoUrl;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Documento guardado correctamente."
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
      control?.markAsTouched();
    }
  }

  getDocumUsuario() {


    if(this._userService.currentUserValue?.rol_users?.role?.name == 'Administrador'){
       this.id_user  = this.route.snapshot.paramMap.get('id') ?? '';
       this.isAdmin = true
    }else{
      this.id_user = String(this._userService.currentUserValue?.id);
    }

    this._documentoService.getDocumentosUser(this.id_user).subscribe({
      next: (response: any) => {
          this.data = response
          this.documentos = response.documentos;
          this.estatusSoli = response.estatusId;

          this.convocatoria = response.convocatoria ?? null;
          this.tipos = (this.convocatoria?.tipos_documento ?? [])
            .slice()
            .sort((a, b) => a.orden - b.orden);
          this.construirFormulario();

          this.documentos.forEach((doc: any) => {

            if (doc) {

                this.archivosRechazados[doc.tipo?.valor] = doc.estatus;
                this.observac[doc.tipo?.valor] = doc.observaciones;
                const archivoUrl = 'https://dev4.siasaf.gob.mx/' + doc.path;

                this.archivosSubidos[doc.tipo?.valor] = archivoUrl;
                this.formDoc.get(doc.tipo?.valor)?.clearValidators();
                this.formDoc.get(doc.tipo?.valor)?.updateValueAndValidity();
            }else{
              this.archivosRechazados[doc.tipo?.valor] = 0;
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

  /** Arma un control por cada documento que pide la convocatoria. */
  private construirFormulario(): void {
    const controles: { [key: string]: any } = {};

    this.tipos.forEach((tipo) => {
      controles[tipo.valor] = [null, tipo.obligatorio ? [Validators.required] : []];
    });

    this.formDoc = this.fb.group(controles);
  }

  sendDoc() {
    this.isLoading = true;
    const id_user = String(this.id_user);
    this._documentoService.sendDocumentos(id_user).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tu registro ha sido enviado.",
          showConfirmButton: false,
          timer: 3000
        });
        if(this.isAdmin){
          this.router.navigate(['/solicitud/registradas']);
        }else{
          this.router.navigate(['/registro/documentos']);
        }

      },
      error: (e: HttpErrorResponse) => {
        this.isLoading = false;
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
        } else {
          console.error('Error desconocido:', e);
        }
      },
    })
  }
}
