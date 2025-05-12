import { Request, Response, NextFunction } from 'express'
import Solicitudes  from '../models/solicitud';
import Documentos  from '../models/documentos';
import TipoDocumentos  from '../models/tipodocumentos';


export const saveDocumentos = async (req: Request, res: Response) => {
   const archivo = req.file; // contiene el archivo subido
   const { tipo, usuario } = req.body;
    
   if (!archivo) {
        res.status(400).json({ message: 'Archivo no recibido' });
    }

    /*console.log('Archivo guardado en:', archivo?.path);
    console.log('Nombre original:', archivo?.originalname);
    console.log('Nombre actual:', archivo?.filename);
    console.log('Tipo de documento:', tipo);
    console.log('Usuario:', usuario);*/

    const solicitud: any = await Solicitudes.findOne({ where: { userId: 2 } })
    if (!solicitud) {
         res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const nuevoDocumento = await Documentos.create({
        solicitudId: solicitud.id,
        path: `storage/${usuario}/${archivo?.filename}`,
        tipoDocumento: 1,
    });

    res.status(201).json({
        message: 'Documento guardado exitosamente',
        documento: nuevoDocumento
    });


};

export const getDocumentos = async (req: Request, res: Response) => {
    const { id } = req.params;

    const solicitudConDocumentos = await Solicitudes.findOne({
        where: { userId: 11 },
        include: [
            {
            model: Documentos,
            as: 'documentos',
            include: [
                {
                model: TipoDocumentos,
                as: 'tipo', // Alias configurado en la relación
                attributes: ['valor'], // Solo traemos el campo que necesitamos
                }
            ],
            },
        ],
        attributes: ['id'], // Puedes incluir más campos si los necesitas
        logging: console.log,
    });

    if(solicitudConDocumentos){
        res.json(solicitudConDocumentos)
    }else{
        res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
};

