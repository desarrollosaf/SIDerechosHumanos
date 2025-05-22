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
@Component({
  selector: 'app-detalle-validador',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule, MatIconModule, RouterModule],
  templateUrl: './detalle-validador.component.html',
  styleUrl: './detalle-validador.component.scss'
})
export class DetalleValidadorComponent {
  id: string;
  isLoading: boolean = false;
  public _documentoService = inject(DocumentoService);
  public _validadorService = inject(ValidadorService);


  archivosSubidos: { [key: string]: string } = {};
  documentos: any;
  solicitante: any;

  documentosRequeridos: {
    clave: string;
    label: string;
    estatus?: number;
    observaciones?: number;
  }[] = [
      { clave: 'curp', label: 'Ser mexicano por nacimiento en pleno goce y ejercicio de sus derechos políticos y civiles (CURP)*:' },
      { clave: 'ine', label: 'Tener residencia efectiva en el territorio del Estado de México no menor de cinco años anteriores al día de su elección (CREDENCIAL PARA VOTAR CON FOTOGRAFÍA VIGENTE, EXPEDIDA POR EL INSTITUTO NACIONAL ELECTORAL)*:' },
      { clave: 'titulo_licenciatura', label: 'Tener preferentemente título de licenciado en derecho, así como experiencia o estudios en materia de derechos humanos (TÍTULO DE LICENCIATURA EN DERECHO)*:' },
      { clave: 'acta_nacimiento', label: 'Tener treinta y cinco años cumplidos, el día de su elección (ACTA DE NACIMIENTO)*:' },
      { clave: 'carta_ant_no_penales', label: 'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada, por delito intencional (CARTA BAJO PROTESTA DE DECIR VERDAD DE QUE SE GOZA DE BUENA FAMA PÚBLICA Y/O CARTA DE ANTECEDENTES NO PENALES)*:' },
      { clave: 'carta_protesta1', label: 'No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección (CARTA BAJO PROTESTA DE DECIR VERDAD)*:' },
      { clave: 'carta_protesta2', label: 'No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección (CARTA BAJO PROTESTA DE DECIR VERDAD)*:' },
      { clave: 'carta_protesta3', label: ' No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos (CARTA BAJO PROTESTA DE DECIR VERDAD)*:' },
      { clave: 'carta_protesta4', label: 'No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado (CARTA BAJO PROTESTA DE DECIR VERDAD)*:' },
      { clave: 'carta_protesta5', label: 'Carta firmada por la persona aspirante, en donde manifiesten su voluntad expresa de participar en el proceso de selección (CARTA)*:' },
      { clave: 'curriculum', label: 'Currículum Vitae en el que se señale su experiencia laboral, formación académica; especialización en derechos humanos; experiencia profesional en el ámbito de la protección, observancia, promoción, estudio y divulgación de los derechos humanos; y, en su caso, publicaciones en materias relacionadas con los derechos humanos (CURRICULUM)*:' },
      { clave: 'propuesta_programa', label: 'Propuesta de programa de trabajo y una descripción de las razones que justifican su idoneidad para ocupar la titularidad de la Comisión Estatal, con una extensión máxima de diez cuartillas, con letra tipo Arial, tamaño número 12 e interlineado 1.5 (PROPUESTA DEL PROGRAMA)*:' },
      { clave: 'copia_certificada', label: 'Copia certificada de los documentos con los que acredite su nacionalidad, ciudadanía y edad; así como de título(s) o grados académicos (COPIAS CERTIFICADAS)*:' },
    ];


  validarrechazar: {
    [key: string]: {
      estado: true | false,
      observaciones: string
      estadoOriginal?: boolean;
    }
  } = {
      curp: {
        estado: true,
        observaciones: ''
      },
      ine: {
        estado: true,
        observaciones: ''
      },
      titulo_licenciatura: {
        estado: true,
        observaciones: ''
      },
      acta_nacimiento: {
        estado: true,
        observaciones: ''
      },
      carta_ant_no_penales: {
        estado: true,
        observaciones: ''
      },
      carta_protesta1: {
        estado: true,
        observaciones: ''
      },
      carta_protesta2: {
        estado: true,
        observaciones: ''
      },
      carta_protesta3: {
        estado: true,
        observaciones: ''
      },
      carta_protesta4: {
        estado: true,
        observaciones: ''
      },
      carta_protesta5: {
        estado: true,
        observaciones: ''
      },
      curriculum: {
        estado: true,
        observaciones: ''
      },
      propuesta_programa: {
        estado: true,
        observaciones: ''
      },
      copia_certificada: {
        estado: true,
        observaciones: ''
      }
    };
  constructor(private aRouter: ActivatedRoute, private router: Router) {
    this.id = String(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getDocumUsuario();
  }

  getDocumUsuario() {
    this._documentoService.getDocumentosUser(this.id).subscribe({
      next: (response: any) => {
        this.solicitante = response;
        this.documentos = response.documentos;

        this.documentos.forEach((doc: any) => {
          const clave = doc.tipo?.valor;
          const archivoUrl = 'https://dev4.siasaf.gob.mx/' + doc.path;
          this.archivosSubidos[clave] = archivoUrl;

          const index = this.documentosRequeridos.findIndex(d => d.clave === clave);
          if (index !== -1) {
            this.documentosRequeridos[index].estatus = doc.estatus;
          }

          this.validarrechazar[clave] = {
            estado: doc.estatus === 1,
            observaciones: doc.observaciones || '',
            estadoOriginal: doc.estatus === 1,
          };
        });
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
      }
    });
  }


  onToggleChange(clave: string) {
    const estadoActual = this.validarrechazar[clave].estado;
    if (estadoActual === true) {
      this.validarrechazar[clave].observaciones = '';
    }

  }

  enviarValidacion(): void {
    const documentosVisibles = this.documentosRequeridos
      .filter(doc => doc.estatus === 1 || doc.estatus === 3)
      .map(doc => doc.clave);
    const documentosArray = Object.entries(this.validarrechazar)
      .filter(([clave, datos]) =>
        documentosVisibles.includes(clave) && datos.estado === false
      )
      .map(([nombre, datos]) => ({
        nombre,
        estado: datos.estado,
        observaciones: datos.observaciones
      }));
       //this.isLoading = true;
    this._documentoService.sendValidacion(documentosArray, this.id).subscribe({
      next: () => {
        //this.isLoading = false; 
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Solicitud validada correctamente.',
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

}
