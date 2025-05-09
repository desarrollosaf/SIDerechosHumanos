import { Component,inject } from '@angular/core';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Documento } from '../../../interfaces/documento';
import { UserService } from '../../../service/user.service';
import { DocumentoService } from '../../../service/documento.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-edit-documentos',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-edit-documentos.component.html',
  styleUrl: './add-edit-documentos.component.scss'
})
export class AddEditDocumentosComponent {
  formDoc: FormGroup;
  files: { [key: string]: File } = {};
  public _userService = inject(UserService);
  public _documentoService  =  inject( DocumentoService );
  constructor(private fb: FormBuilder){
    this.formDoc = this.fb.group({
      curp:[null, Validators.required],
      ine:[null, Validators.required],
      titulo_licenciatura:[null, Validators.required],
      acta_nacimiento:[null, Validators.required],
      carta_ant_no_penales:[null, Validators.required],
      carta_protesta1: [null, Validators.required],
      carta_protesta2:[null, Validators.required],
      carta_protesta3:[null, Validators.required],
      carta_protesta4:[null, Validators.required],
      carta_protesta5:[null, Validators.required],
      curriculum:[null, Validators.required],
      propuesta_programa:[null, Validators.required],
      copia_certificada:[null, Validators.required],
    },
    { validators: []
    });
  }

  ngOnInit(): void {
    this.getcurrusr();
  }


getcurrusr(){
  console.log(this._userService.currentUserValue?.id);
}
  onFile7(event: Event, controlName: string, maxmb: number): void {
    console.log();
    const input = event.target as HTMLInputElement;
    const control = this.formDoc.get(controlName);
    const currntUsr = this._userService.currentUserValue?.id;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = maxmb * 1024 * 1024;
  
      if (file.size > maxSize) {
        control?.setErrors({ fileSize: true });
      } else {
        
        control?.setErrors(null); // Borra errores anteriores
        this.files[controlName] = file; // Guarda el archivo localmente

        //cambiar la variable de usuario logueado
        const document: Documento = {
          tipo: input.id,
          archivo: this.files[controlName],
          usuario: 1
        }
        const formData = new FormData();
        formData.append('tipo', input.id); // asegúrate de convertirlo a string si es un número
        formData.append('archivo', this.files[controlName]); // debe ser un objeto File o Blob
        formData.append('usuario', '1');
        console.log(document)
        this._documentoService.saveDocumentos(formData).subscribe({
          next: (response: any) => {
            console.log('holi');
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
  sendDoc(){
    console.log('hola');
    const document: Documento = {
      estatus:1,
      usuario: 1
    }
    console.log('hola');
  }


}

