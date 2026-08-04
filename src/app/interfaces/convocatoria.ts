export interface TipoDocumento {
    id: number;
    /** Identificador del campo en el formulario (curp, ine, curriculum...). */
    valor: string;
    /** Requisito legal que acredita el documento. */
    requisito: string | null;
    /** Nombre del archivo que debe cargar la persona aspirante. */
    documento_requerido: string | null;
    orden: number;
    obligatorio: boolean;
    max_mb: number;
}

export interface Convocatoria {
    id: number;
    slug: string;
    nombre: string;
    titulo: string;
    organismo: string | null;
    aviso_privacidad_url: string | null;
    sede: string | null;
    periodo_texto: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    activa: boolean;
    /** true si hoy está dentro del periodo de captura. */
    abierta: boolean;
    tipos_documento?: TipoDocumento[];
}
