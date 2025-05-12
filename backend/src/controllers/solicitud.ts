import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  Solicitudes   from '../models/solicitud'
import User  from '../models/user'
const nodemailer = require('nodemailer');
import dotenv from "dotenv";
dotenv.config();





export const getRegistros = async (req: Request, res: Response): Promise<any> => {
    const listSolicitudes = await Solicitudes.findAll()
    return res.json({
        msg: `List de exitosamente`,
        data: listSolicitudes
    });
}

export const getRegistro = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
      return res.json(solicitud)
    }else{
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const deleteRegistro = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
        await solicitud.destroy();
        return res.json({
            msg: `Eliminado con exito`,
        });
    }else{
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const saveRegistro = async (req: Request, res: Response): Promise<any> => {
    const { body } = req;
  
    function generateRandomPassword(length: number = 10): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }
  
    try {
      const Upassword = generateRandomPassword(12);
      const UpasswordHash = await bcrypt.hash(Upassword, 10);
  
      const newUser = await User.create({
        name: body.curp,
        email: body.correo,
        password: UpasswordHash,
      });
      console.log(newUser.id)
      body.userId = newUser.id;
      console.log(body)
      await Solicitudes.create(body);
  
      // Configurar el transporte del correo
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  
      // Enviar el correo
      await transporter.sendMail({
        from: `"Registro" <${process.env.SMTP_USER}>`, 
        to: body.correo,
        subject: "Tus credenciales de acceso",
        html: `
          <h3>Hola ${body.nombres},</h3>
          <p>Tu cuenta ha sido creada exitosamente. Aquí tienes tus credenciales:</p>
          <ul>
            <li><strong>Email:</strong> ${body.correo}</li>
            <li><strong>Contraseña:</strong> ${Upassword}</li>
          </ul>
          <p>Por favor cambia tu contraseña al iniciar sesión.</p>
        `,
      });
  
      return res.json({ msg: `Agregado con éxito y correo enviado` });

    } catch (error) {
      
      console.error(error);
      return res.status(500).json({ msg: `Ocurrió un error al registrar` });
    }
  };

export const putRegistro = async (req: Request, res: Response): Promise<any> => {
    return res.status(404).json({
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




