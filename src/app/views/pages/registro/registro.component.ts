import { Component, inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl} from '@angular/forms'
import { CommonModule } from '@angular/common';
import {Registro} from '../../../interfaces/registro'
import { Convocatoria } from '../../../interfaces/convocatoria'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {RegistroService} from '../../../service/registro.service'
import { ConvocatoriaService } from '../../../service/convocatoria.service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro',
  imports: [CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  formReg: FormGroup;
  miControl = new FormControl('');
  public _registroService  =  inject( RegistroService )
  public _convocatoriaService = inject( ConvocatoriaService )
  private http = inject( HttpClient )
  private sanitizer = inject( DomSanitizer )

  /** Convocatoria a la que corresponde esta liga de registro. */
  convocatoria: Convocatoria | null = null;
  /** Aviso de privacidad de la convocatoria (public/assets/avisos/<slug>.html). */
  avisoPrivacidad: SafeHtml | null = null;
  cargando = true;
  errorConvocatoria = '';

  constructor(private fb: FormBuilder,private router: Router, private route: ActivatedRoute, private modalService: NgbModal){
    this.formReg = this.fb.group({
      ap_paterno:['', Validators.required],
      ap_materno:['', Validators.required],
      nombres:[null, Validators.required],
      correo:['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      celular:['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      confirmtel: ['',[Validators.required, Validators.pattern(/^\d{10}$/)]],
      curp:['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/)
      ]],
      aviso_privacidad:[false, Validators.requiredTrue],
    },
    { validators: [this.validadorTelefono, this.validadorCorreo]


    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.cargando = false;
      this.errorConvocatoria = 'No se indicó la convocatoria.';
      return;
    }

    this._convocatoriaService.getConvocatoria(slug).subscribe({
      next: (convocatoria: Convocatoria) => {
        this.convocatoria = convocatoria;
        this.cargando = false;
        if (!convocatoria.abierta) {
          this.errorConvocatoria = 'El periodo de registro de esta convocatoria no se encuentra abierto.';
        }
        this.cargarAviso(slug);
      },
      error: () => {
        this.cargando = false;
        this.errorConvocatoria = 'La convocatoria solicitada no existe o no está disponible.';
      },
    });
  }

  /** El aviso de privacidad vive como archivo por convocatoria para que el
   *  área jurídica pueda actualizarlo sin tocar el código. */
  private cargarAviso(slug: string): void {
    this.http.get(`assets/avisos/${slug}.html`, { responseType: 'text' }).subscribe({
      next: (html: string) => {
        this.avisoPrivacidad = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: () => {
        this.avisoPrivacidad = null;
      },
    });
  }

  validadorTelefono(formGroup: FormGroup): { [key: string]: boolean } | null {
    const phoneNumber = formGroup.get('celular')?.value;
    const confirmPhoneNumber = formGroup.get('confirmtel')?.value;
    if (phoneNumber !== confirmPhoneNumber) {
      return { 'phonesDoNotMatch': true };
    }else{
      return null;
    }
  }
   convertirAMayuscula(controlName: string) {
    const valor = this.formReg.get(controlName)?.value || '';
    this.formReg.get(controlName)?.setValue(valor.toUpperCase(), { emitEvent: false });
  }
  validadorCorreo(formGroup: FormGroup): { [key: string]: boolean } | null {
    const email = formGroup.get('correo')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;
    if (email !== confirmEmail) {
      return { 'emailsDoNotMatch': true };
    }else{
      return null;
    }
  }

  onAvisoChange(event: Event, modalRef: TemplateRef<any>) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.openLgModal(modalRef);
    }
  }

  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  sendReg(){

    if (!this.convocatoria) {
      return;
    }

    const registroval: Registro = {
      ap_paterno: this.formReg.value.ap_paterno,
      ap_materno: this.formReg.value.ap_materno,
      nombres: this.formReg.value.nombres,
      correo: this.formReg.value.correo,
      celular: this.formReg.value.celular,
      curp: this.formReg.value.curp,
      aviso_privacidad: this.formReg.value.aviso_privacidad,
      convocatoria: this.convocatoria.slug,
    }

    this._registroService.saveRegistro(registroval).subscribe({
      next: (response: any) => {
        const correo = response.correo
        if(response.estatus == 400){
          Swal.fire({
              position: "center",
              icon: "error",
              title: "¡Atención!",
              text: response.mensaje || `Ya existe un registro con el correo: ${correo}.`,
              showConfirmButton: false,
              timer: 5000
            });
            this.formReg.get('confirmEmail')?.reset('');
            this.formReg.get('confirmEmail')?.markAsTouched();
            this.formReg.get('correo')?.reset('');
            this.formReg.get('correo')?.markAsTouched();

        }else{
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Solicitud registrada satisfactoriamente!",
            text: `Para continuar con el trámite, se han enviado a la cuenta de correo electrónico ${correo} las instrucciones para continuar con el proceso de registro. Si no encuentra el correo en la bandeja de entrada, verifique en el apartado de Correo no deseado o Spam.`,
            showConfirmButton: false,
            timer: 10000
          });
          this.router.navigate(['/']);
        }
      },
      error: (e: HttpErrorResponse) => {
        // El backend responde 400 cuando la persona ya está inscrita en otra
        // convocatoria y 404 cuando la convocatoria no existe.
        const mensaje = e.error?.mensaje || e.error?.msg;
        if (mensaje) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Atención!",
            text: mensaje,
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: 'Error desconocido: '+e,
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/']);
        }
      },
    })

  }



}
