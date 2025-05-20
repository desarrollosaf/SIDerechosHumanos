import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';
import {Registro} from '../../../interfaces/registro'
import { HttpErrorResponse } from '@angular/common/http';
import {RegistroService} from '../../../service/registro.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  formReg: FormGroup;
  
  public _registroService  =  inject( RegistroService )

  constructor(private fb: FormBuilder,private router: Router){
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
      cedula_profesional:['', Validators.required],
      aviso_privacidad:[false, Validators.requiredTrue],
    },
    { validators: [this.validadorTelefono, this.validadorCorreo]


     });
  }

  ngOnInit(): void {
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

  validadorCorreo(formGroup: FormGroup): { [key: string]: boolean } | null {
    const email = formGroup.get('correo')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;
    if (email !== confirmEmail) {
      return { 'emailsDoNotMatch': true };
    }else{
      return null;
    }
  }

  sendReg(){

    const registroval: Registro = {
      ap_paterno: this.formReg.value.ap_paterno,
      ap_materno: this.formReg.value.ap_materno,
      nombres: this.formReg.value.nombres,
      correo: this.formReg.value.correo,
      celular: this.formReg.value.celular,
      curp: this.formReg.value.curp,
      cedula_profesional: this.formReg.value.cedula_profesional,
      aviso_privacidad: this.formReg.value.aviso_privacidad,
    }
    console.log(registroval)

  
    this._registroService.saveRegistro(registroval).subscribe({
      next: (response: any) => {
        console.log(response);     
        Swal.fire({
          position: "center", // posición centrada
          icon: "success",
          title: "Tu registro ha sido enviado.",
          showConfirmButton: false,
          timer: 3000
        });

        this.router.navigate(['/']);
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
          // Aquí podrías usar un alert o mostrar en pantalla
        } else {
          console.error('Error desconocido:', e);
        }
      },
    }) 

    console.log(registroval);
    // if (this.formReg.valid) {
    //   console.log('Formulario enviado:', this.formReg.value);
    // } else {
    //   console.log('Formulario no válido');
    // }

  }



}
