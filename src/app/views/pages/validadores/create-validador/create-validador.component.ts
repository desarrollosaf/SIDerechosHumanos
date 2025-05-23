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
      ap_paterno:['', Validators.required],
      ap_materno:['', Validators.required],
      nombres:[null, Validators.required],
      correo:['', [Validators.required, Validators.email]],
      curp:['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/)
      ]],
    });
  }


  ngOnInit(): void {
  }


  envio():void {      
    if (this.formReg.valid) {
      console.log('Formulario válido, enviando...');
  
    } else {
      this.formReg.markAllAsTouched();
    }
  }

}
