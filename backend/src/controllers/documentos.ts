import { Request, Response, NextFunction } from 'express'
import { Solicitudes, Documentos, TipoDocumentos } from '../models';


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

    const documentos = await Documentos.findAll({
        where: { solicitudId: 1 },
        include: [
          {
            model: TipoDocumentos,
            as: 'tipo',
            attributes: ['valor'] 
          }
        ],
        logging: console.log
      });


    const documentosFormateados = documentos.map(doc => ({
        ...doc.toJSON(),
        tipoDocumento: doc.tipo?.valor || null
    }));

    if(documentosFormateados){
        res.json(documentosFormateados)
    }else{
        res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
};

