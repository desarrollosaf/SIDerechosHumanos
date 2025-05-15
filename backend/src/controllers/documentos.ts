import { Request, Response, NextFunction } from 'express'
import Solicitudes  from '../models/solicitud';
import Documentos  from '../models/documentos';
import TipoDocumentos  from '../models/tipodocumentos';
import fs from 'fs';
import path from 'path';


export const saveDocumentos = async (req: Request, res: Response): Promise<any> => {
    const archivo = req.file; 
    const { tipo, usuario } = req.body;

    
    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no recibido' });
    }

    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] 
            }
        ]
    });
    let documentoGuardado;
    const tipo1 = await TipoDocumentos.findOne({
        where: { valor: tipo } 
    });
    if (!tipo1) {
        return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }

    if (documentoExistente) {
        const documentoPath = path.resolve(documentoExistente.path);
        
        if (fs.existsSync(documentoPath)) {
            fs.unlinkSync(documentoPath);
        }
        
        documentoExistente.path = `storage/${usuario}/${archivo.filename}`;
        await documentoExistente.save();
        documentoGuardado = documentoExistente;
    } else {
        
        documentoGuardado = await Documentos.create({
            solicitudId: solicitud.id,
            path: `storage/${usuario}/${archivo.filename}`,
            tipoDocumento: tipo1.id, 
            estatus: 1
        });
    }

    return res.status(201).json({
        message: 'Documento guardado exitosamente',
        documento: documentoGuardado
    });
};

export const getDocumentos = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const solicitudConDocumentos = await Solicitudes.findOne({
        where: { userId: id },
        include: [
            {
            model: Documentos,
            as: 'documentos',
            include: [
                {
                model: TipoDocumentos,
                as: 'tipo', 
                attributes: ['valor'], 
                }
            ],
            },
        ],
        // attributes: ['id'],
        logging: console.log,
    });

    if(solicitudConDocumentos){
        return res.json(solicitudConDocumentos)
    }else{
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
};

export const envSolicitud = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const solicitud: any = await Solicitudes.findOne({ where: { userId: id } });
    if(solicitud){
         solicitud.estatusId = 2;
        await solicitud.save();
      return res.json('200')
    }else{
      return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const deleteDoc = async (req: Request, res: Response): Promise<any> => {
    const { tipo, usuario } = req.body;
    
    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] 
            }
        ]
    });

    if(documentoExistente){
        const documentoPath = path.resolve(documentoExistente.path);
        if (fs.existsSync(documentoPath)) {
            fs.unlinkSync(documentoPath);
        }
      return res.json('200')
    }else{
      return res.status(404).json({
            msg: `No existe el documento con el tipo y solicitud${usuario}`,
        });
    }
}

export const estatusDoc = async (req: Request, res: Response): Promise<any> => {
    const { tipo, usuario, estatus, observaciones } = req.body;
    
    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] 
            }
        ]
    });

    if(documentoExistente){
       documentoExistente.estatus = estatus; 
        documentoExistente.observaciones = observaciones; 
       await documentoExistente.save();
      return res.json('200')
    }else{
      return res.status(404).json({
            msg: `No existe el documento con el tipo y solicitud${usuario}`,
        });
    }
}


