import { Component, inject } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-validador',
  imports: [RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-validador.component.html',
  styleUrl: './create-validador.component.scss'
})
export class CreateValidadorComponent {
  formReg: FormGroup;
  public validadoresList: any[] = [];
  public _userService = inject(UserService);
  id:any;
  operacion: string = 'Registrar';
 
  constructor(private fb: FormBuilder,private router: Router,  private  aRouter: ActivatedRoute){
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

    this.id = aRouter.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    if(this.id != null){
      this.operacion = 'Editar ';
      console.log(this.operacion);
    }
  }
  envio():void {      
    if (this.formReg.valid) {
      console.log('Formulario válido, enviando...');
      const datos = {
        apaterno: this.formReg.value.ap_paterno, 
        amaterno: this.formReg.value.ap_materno,
        nombre: this.formReg.value.nombres,
        correo: this.formReg.value.correo,
        curp: this.formReg.value.curp,
      };
      this._userService.saveValidador(datos).subscribe({
        next: (response: any) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Validador regristrado",
            showConfirmButton: false,
            timer: 3000
          });
          this.formReg.reset();
        },
        error: (e: HttpErrorResponse) => {
        console.error('Error:', e.error?.msg || e);
        }
      });
    } else {
      this.formReg.markAllAsTouched();
    }
  }

}
