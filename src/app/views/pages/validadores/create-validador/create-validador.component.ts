import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-validador',
  imports: [RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-validador.component.html',
  styleUrl: './create-validador.component.scss'
})
export class CreateValidadorComponent {
  formReg: FormGroup;

  constructor(private fb: FormBuilder,private router: Router){
    this.formReg = this.fb.group({
      correo:['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      curp:['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/)
      ]],
    },{ validators: [this.validadorCorreo] });
  }


  ngOnInit(): void {
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

  envio():void {
    if (this.formReg.valid) {
      console.log('Formulario válido, enviando...');
  
    } else {
      this.formReg.markAllAsTouched();
    }
  }

}
