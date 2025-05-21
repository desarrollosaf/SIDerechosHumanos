import { Request, Response, NextFunction } from 'express'
import Solicitudes  from '../models/solicitud';
import Documentos  from '../models/documentos';
import TipoDocumentos  from '../models/tipodocumentos';
import fs from 'fs';
import path from 'path';
import RolUsers from '../models/role_users';
import ValidadorSolicitud from '../models/validadorsolicitud';
import User from '../models/user';
import { sendEmail } from '../utils/mailer';


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
         documentoExistente.estatus = 1;
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

    if (!solicitud) {
        return res.status(404).json({ msg: `No existe el id ${id}` });
    }

    const validadores: any[] = await RolUsers.findAll({ where: { role_id: 2 } });
    if (validadores.length === 0) {
        return res.status(400).json({ msg: "No hay validadores disponibles" });
    }

    const validadorConMenosSolicitudes = await Promise.all(
        validadores.map(async (validador) => {
        const count = await ValidadorSolicitud.count({ where: { validadorId: validador.user_id } });
        return { validador, count };
        })
    ).then((results) => results.sort((a, b) => a.count - b.count)[0].validador);
   
    await ValidadorSolicitud.create({
        solicitudId: solicitud.id,
        validadorId: validadorConMenosSolicitudes.user_id,
    });

    solicitud.estatusId = 2;
    await solicitud.save();
    return res.json("200");
};

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
  try {
    const userId = req.params.id;
    const Documentos2 = req.body; 
    const solicitud = await Solicitudes.findOne({
    where: { userId },
        include: [
            {
            model: User,
            as: 'usuario',
            attributes: ['email'],
            },
        ],
    });
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const documentosExistentes = await Documentos.findAll({
      where: { solicitudId: solicitud.id },
      include: [{ model: TipoDocumentos, as: 'tipo' }]
    });
    const observados: { tipo: string; observaciones: string }[] = [];
    for (const documentoExistente of documentosExistentes) {
    const tipoValor = documentoExistente.tipo?.valor;
    const documentoEntrada = Documentos2.find((doc: any) => doc.nombre === tipoValor);
    if (documentoEntrada && tipoValor) {
        documentoExistente.estatus = 3;
        documentoExistente.observaciones = documentoEntrada.observaciones || '';
        observados.push({ tipo: tipoValor, observaciones: documentoEntrada.observaciones || '' });
    } else {
        documentoExistente.estatus = 2;
    }
    await documentoExistente.save();
    }
    const usuario = (solicitud as any).usuario;
    const emailDestino = usuario?.email;

    if (!emailDestino) {
    console.warn('No se encontró email del usuario');
    } else {
    if (observados.length > 0) {
        const contenido = observados.map(
        o => `- ${o.tipo}: ${o.observaciones}`
        ).join('\n');


        (async () => {
            await sendEmail(
                emailDestino, 
                'Revisión de documentos',
                `Se observaron los siguientes documentos:\n\n${contenido}`
            );
        })();

        solicitud.estatusId = 4;
        await solicitud.save();

    } else {
        
        (async () => {
            await sendEmail(
                emailDestino, 
                'Revisión de documentos',
                'Todos tus documentos fueron revisados y están correctos.'
            );
        })();

        solicitud.estatusId = 3;
        await solicitud.save();
    }
    }

    return res.status(200).json({ message: 'Documentos actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar documentos:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


