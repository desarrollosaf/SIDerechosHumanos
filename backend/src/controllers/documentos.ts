import { Request, Response, NextFunction } from 'express'
import  Documentos   from '../models/documentos'
import  Solicitudes   from '../models/solicitud'


export const saveDocumentos = async (req: Request, res: Response) => {
    const { body } = req;
    const archivo = req.file;

    if (!archivo) {
        res.status(400).json({ message: 'Archivo no recibido' });
    }

    const solicitud: any = await Solicitudes.findOne({ where: { userId: 9 } })

    if (!solicitud) {
         res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const nuevoDocumento = await Documentos.create({
        solicitudId: solicitud.id,
        path: 'archivo.path',
        tipoDocumento: "1",
    });

    res.status(201).json({
        message: 'Documento guardado exitosamente',
        documento: nuevoDocumento
    });


};

