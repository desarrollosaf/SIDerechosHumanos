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
@Component({
  selector: 'app-detalle-validador',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule, MatIconModule, RouterModule,NgSelectModule,NgbAlertModule],
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
  public currentUser: any;
  public esAdmin: boolean = false;
  public usuariosValidador: any[] = [];
  validadorSeleccionado: string = '';
  documentosRequeridos: {
    clave: string;
    label: string;
    txt:string;
    estatus?: number;
    observaciones?: number;
  }[] = [
      { clave: 'curp', label: 'Ser mexicano en pleno goce y ejercicio de sus derechos políticos y civiles.' , txt: 'Documento requerido: Clave Única de Registro de Población (CURP)*:'},
      { clave: 'constancia_residencia', label: 'Tener residencia efectiva en el territorio del Estado de México no menor de cinco años anteriores al día de su elección.' , txt: 'Documento requerido Constancia de residencia en la entidad no menor de cinco años anteriores al día de su designación, que podrá acreditarse con manifestación bajo protesta de decir verdad sobre su residencia *:'},
      { clave: 'titulo_licenciatura', label: 'Tener preferentemente título de licenciado en derecho, así como experiencia o estudios en materia de derechos humanos.' , txt: 'Documento requerido: Título de Licenciatura en Derecho*:'},
      { clave: 'acta_nacimiento', label: 'Tener treinta y cinco años cumplidos, el día de su elección.' , txt: 'Documento requerido: Acta de nacimiento en copia certificada o, en su caso, documento que acredite la nacionalidad mexicana *:'},
      { clave: 'carta_ant_no_penales', label: 'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada, por delito intencional.' , txt: 'Documento requerido: Carta bajo protesta de decir verdad y/o carta de antecedentes no penales*:'},
      { clave: 'carta_protesta1', label: 'No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección.' , txt: 'Documento requerido: Carta bajo protesta de decir verdad*:'},
      { clave: 'carta_protesta2', label: 'No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección.' , txt: ''},
      { clave: 'carta_protesta3', label: 'No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos.' , txt: 'Documento requerido: Carta bajo protesta de decir verdad*:'},
      { clave: 'carta_protesta4', label: 'No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado.' , txt: 'Documento requerido: Carta bajo protesta de decir verdad*:'},
      { clave: 'carta_protesta5', label: 'Carta firmada de manera autógrafa en donde manifieste su voluntad expresa de participar en el proceso de selección, así como su aceptación y conformidad con las bases, procedimientos y deliberaciones del proceso.' , txt: 'Documento requerido: Carta de manifestación de voluntad*:'},
      { clave: 'curriculum', label: 'Currículum Vitae firmado autógrafamente por la persona aspirante, en el que se señale su experiencia laboral, formación académica; especialización en derechos humanos; experiencia profesional en el ámbito de la protección, observancia, promoción, estudio y divulgación de los derechos humanos; y, en su caso, publicaciones en materias relacionadas con los derechos humanos.' , txt: 'Documento requerido: Currículum Vitae*:'},
      { clave: 'propuesta_programa', label: 'Documento impreso con la propuesta de programa de trabajo con una extensión máxima de diez cuartillas, con letra tipo Arial, tamaño número 12 e interlineado 1.5.' , txt: 'Documento requerido: propuesta de programa de trabajo*:'},
      { clave: 'copia_certificada', label: 'Copia certificada de los documentos con los que acredite su título(s) o grado(s) académico(s);' , txt: 'Documento requerido: Copias certificadas correspondientes*:'},
      { clave: 'ine', label: 'Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible, de preferencia ampliada al 200% y en original para su cotejo.' , txt: 'Documento requerido: Credencial para votar con fotografía vigente*:'},
      { clave: 'informe_no_penales', label: 'Informe de no antecedentes penales, expedido por la Fiscalía General de Justicia del Estado de México, con fecha de expedición no mayor a treinta días anteriores a la fecha de su presentación.' , txt: 'Documento requerido: Informe de no antecedentes penales*:'},
      { clave: 'carta_motivos', label: 'Carta de exposición de motivos firmada por la persona aspirante y descripción de las razones que justifican su idoneidad, con una extensión no mayor a tres cuartillas.' , txt: 'Documento requerido: Carta de exposición de motivos*:'},
      { clave: 'escrito_consentimiento', label: 'Escrito de consentimiento para el tratamiento de datos personales, así como Aviso de Privacidad relativo al tratamiento de los datos personales descritos en la presente Convocatoria. Ambos documentos deberán descargarse de página https://legislacion.legislativoedomex.gob.mx/avisosdeprivacidad y deberán ser entregados debidamente firmados por la o el aspirante.' , txt: 'Documento requerido: Escrito de consentimiento*:'},

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
      constancia_residencia: {
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
      },
      ine: {
        estado: true,
        observaciones: ''
      },
      informe_no_penales: {
        estado: true,
        observaciones: ''
      },
      carta_motivos: {
        estado: true,
        observaciones: ''
      },
      escrito_consentimiento: {
        estado: true,
        observaciones: ''
      }
    };

  constructor(private aRouter: ActivatedRoute, private router: Router) {
    this.id = String(aRouter.snapshot.paramMap.get('id'));
    this.currentUser = this._userService.currentUserValue;
    this.esAdmin = this.currentUser.rol_users?.role?.name === 'Administrador';
  }

  ngOnInit(): void {
    this.getDocumUsuario();
  }

  obtenerValidadores(){
    this._userService.getValidadores().subscribe({
      next: (response: any) => {
        this.usuariosValidador= response.data;
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
      }
    });
  }
  
  reasignarValidador(usuario: any){
    const idSolicitud= this.solicitante.documentos[0]?.solicitudId;
    const id = usuario?.id;
    if(id){
        const datos = {
        usuario: id, solicitud: idSolicitud
      };
      this._userService.reasignarValidador(datos).subscribe({
        next: (response: any) => {
          const valida = usuario?.datos_user?.nombre + ' ' + usuario?.datos_user?.apaterno + ' ' + usuario?.datos_user?.amaterno;
          this.validadorSol=valida;
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
    }else{
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
        this.validadorSol= response.validasolicitud.validador.datos_user.nombre + ' ' + response.validasolicitud.validador.datos_user.apaterno + ' ' + response.validasolicitud.validador.datos_user.amaterno;
        this.solicitante = response;
        this.documentos = response.documentos;
        this.estatusSoli = response.estatusId;
        this.documentos.forEach((doc: any) => { 
          const clave = doc.tipo?.valor;
          const archivoUrl = 'https://dev4.siasaf.gob.mx/' + doc.path;
          this.archivosSubidos[clave] = archivoUrl;
          const index = this.documentosRequeridos.findIndex(d => d.clave === clave);
          if (index !== -1) {
            this.documentosRequeridos[index].estatus = doc.estatus;
          }
            if(doc.estatus == 2){
              this.validarrechazar[clave] = {
                estado: doc.estatus === 2,
                observaciones: doc.observaciones || '',
                estadoOriginal: doc.estatus === 2,
              };
            }else{
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

}
