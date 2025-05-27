import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-cambiar-contrasena',
  imports: [NgStyle, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.scss'
})
export class CambiarContrasenaComponent {
  showPassword1: boolean = false;
  showPassword2: boolean = false;

  formPassword: FormGroup;
  constructor(private fb: FormBuilder){
    this.formPassword = this.fb.group({
      password1:['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      password2:['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      },{ validators: [this.matchPasswords]}
    );
  }

  ngOnInit(): void {
  }

  togglePassword(field: number): void {
    if (field === 1) {
      this.showPassword1 = !this.showPassword1;
    } else if (field === 2) {
      this.showPassword2 = !this.showPassword2;
    }
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password1')?.value;
    const confirm = group.get('password2')?.value;
    return pass === confirm ? null : { noMatch: true };
  }

  cambiarContrasena(){
    if (this.formPassword.valid) {
      console.log('Formulario enviado:', this.formPassword.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}

