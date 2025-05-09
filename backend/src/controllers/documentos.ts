import { Request, Response, NextFunction } from 'express'
import  Documentos   from '../models/documentos'
import  Solicitudes   from '../models/solicitud'


export const saveDocumentos = async (req: Request, res: Response) => {
    const { body } = req;
    const solicitud: any = await Solicitudes.findOne({ where: { userId: 9 } })
    console.log(solicitud)


};