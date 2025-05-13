import { Request, Response, NextFunction } from 'express'
import Solicitudes  from '../models/solicitud';
import Documentos  from '../models/documentos';
import TipoDocumentos  from '../models/tipodocumentos';
import fs from 'fs';
import path from 'path';


export const saveDocumentos = async (req: Request, res: Response): Promise<any> => {
    const archivo = req.file; // contiene el archivo subido
    const { tipo, usuario } = req.body;

    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no recibido' });
    }

    const solicitud: any = await Solicitudes.findOne({ where: { userId: usuario } });
    if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar si ya existe un documento de ese tipo para la solicitud
    const documentoExistente = await Documentos.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: TipoDocumentos,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] // No traer campos de TipoDocumentos, solo filtrar
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
        // Verificar si el archivo existe y eliminarlo
        if (fs.existsSync(documentoPath)) {
            fs.unlinkSync(documentoPath);
        }
        // Actualizar el documento existente
        documentoExistente.path = `storage/${usuario}/${archivo.filename}`;
        await documentoExistente.save();
        documentoGuardado = documentoExistente;
    } else {
        // Crear un nuevo documento si no existe
        documentoGuardado = await Documentos.create({
            solicitudId: solicitud.id,
            path: `storage/${usuario}/${archivo.filename}`,
            tipoDocumento: tipo1.id, // Asegúrate de que este valor sea un ID correcto
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
        attributes: ['id'],
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

