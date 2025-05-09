import { Component } from '@angular/core';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Documento } from '../../../interfaces/documento';


@Component({
  selector: 'app-add-edit-documentos',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-edit-documentos.component.html',
  styleUrl: './add-edit-documentos.component.scss'
})
export class AddEditDocumentosComponent {
  formDoc: FormGroup;
  files: { [key: string]: File } = {};
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





  onFile7(event: Event, controlName: string, maxmb: number): void {
    const input = event.target as HTMLInputElement;
    const control = this.formDoc.get(controlName);
   
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = maxmb * 1024 * 1024;
  
      if (file.size > maxSize) {
        control?.setErrors({ fileSize: true });
      } else {
        
        control?.setErrors(null); // Borra errores anteriores
        this.files[controlName] = file; // Guarda el archivo localmente



        const document: Documento = {
          tipo: input.id,
          archivo: this.files[controlName],
        }
console.log(document);

      }
  
      control?.markAsTouched();
    }
  }
  sendDoc(){
    console.log('hola');
  }


}

