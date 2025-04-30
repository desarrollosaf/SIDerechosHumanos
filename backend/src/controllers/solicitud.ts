import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { Solicitudes } from '../models/solicitud'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'


export const getRegistros = async (req: Request, res: Response) => {
    const listSolicitudes = await Solicitudes.findAll()
    res.json({
        msg: `List de exitosamente`,
        data: listSolicitudes
    });
}

export const getRegistro = async (req: Request, res: Response) => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
        res.json(solicitud)
    }else{
        res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const deleteRegistro = async (req: Request, res: Response) => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
        await solicitud.destroy();
        res.json({
            msg: `Eliminado con exito`,
        });
    }else{
        res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const saveRegistro = async (req: Request, res: Response) => {
    const { body } = req;
    console.log(req);
    res.status(404).json({
        msg: `${body}`,
    });
    // try {
    //     await Solicitudes.create(body);
    //     res.json({
    //         msg: `Agregado con exito`,
    //     });
    // }catch (error){
    //     console.log(error);
    //     res.json({
    //         msg: `Ocurrio un error al cargar `,
    //     });
    // }
}

export const putRegistro = async (req: Request, res: Response) => {
    res.status(404).json({
        msg: 'put',
    });
    // try {
    //     await Solicitudes.create(body);
    //     res.json({
    //         msg: `Agregado con exito`,
    //     });
    // }catch (error){
    //     console.log(error);
    //     res.json({
    //         msg: `Ocurrio un error al cargar `,
    //     });
    // }
}




