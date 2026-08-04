export interface Registro {
      ap_paterno: string;
      ap_materno: string;
      nombres: string;
      correo: string;
      celular: string;
      curp: string;
      cedula_profesional?: string;
      aviso_privacidad: boolean;
      /** Slug de la convocatoria a la que se inscribe la persona. */
      convocatoria: string;
}
