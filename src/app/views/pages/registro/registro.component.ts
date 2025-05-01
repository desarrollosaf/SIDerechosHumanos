import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  formReg: FormGroup;

  constructor(private fb: FormBuilder){
    this.formReg = this.fb.group({
      ap_paterno:['', Validators.required],
      ap_materno:['', Validators.required],
      nombres:[null, Validators.required],
      correo:['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      celular:['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      confirmtel: ['',[Validators.required, Validators.pattern(/^\d{10}$/)]],
      curp:['', Validators.required],
      cedula_profesional:['', Validators.required],
      // aviso_privacidad:['', Validators.required],
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
      console.log('NOestachido');
      return { 'emailsDoNotMatch': true };
    }else{
      console.log('estachido');
      return null;
    }
   
  }


  
  sendReg(){
    console.log(this.formReg);
    if (this.formReg.valid) {
      console.log('Formulario enviado:', this.formReg.value);
    } else {
      console.log('Formulario no válido');
    }
   
  }



}
