import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  Solicitudes   from '../models/solicitud'
import User  from '../models/user'
import RolUsers  from '../models/role_users'
const nodemailer = require('nodemailer');
import dotenv from "dotenv";
import ValidadorSolicitud from '../models/validadorsolicitud'
dotenv.config();
import { sendEmail } from '../utils/mailer';


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
      rol_users: {
        role_id: 3,  
      },
    }, {
      include: [{ model: RolUsers, as: 'rol_users' }],
    });
    body.userId = newUser.id;
    body.estatusId = 1;
    await Solicitudes.create(body);
    
    (async () => {
      try {
        const contenido = `
            <h3>Hola ${body.nombres},</h3>
            <p>Tu cuenta ha sido creada exitosamente. Aquí tienes tus credenciales:</p>
            <ul>
              <li><strong>Email:</strong> ${body.correo}</li>
              <li><strong>Contraseña:</strong> ${Upassword}</li>
            </ul>
            <p>Por favor cambia tu contraseña al iniciar sesión.</p>
          `;
        let htmlContent = generarHtmlCorreo(contenido);
        await sendEmail(
                    body.correo,
                    'Tus credenciales de acceso',
                    htmlContent
        );

        console.log('Correo enviado correctamente');
      } catch (err) {
        console.error('Error al enviar correo:', err);
      }
    })();

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

  export const getSolicitudes = async (req: Request, res: Response): Promise<any> => {
      const { id, usuario } = req.body;
      console.log('USUARIO ES: ', usuario);
      const user: any = await User.findOne({ 
        where: { id: usuario },
        include: [
        {
            model: RolUsers,
            as: 'rol_users',
        }
        ]
      })
     
      const roleId = user.rol_users.role_id
      
      let listSolicitudes: any[] = [];
      if(user && roleId == 1){
        listSolicitudes = await Solicitudes.findAll({
            where: {
                estatusId: id 
            }
        });
        
      }else{
          listSolicitudes = await Solicitudes.findAll({
            where: {
              estatusId: id,
            },
            include: [
              {
                model: ValidadorSolicitud,
                as: "validasolicitud",
                where: {
                  validadorId: usuario,
                },
              },
            ],
          });
      }
      
      return res.json({
          msg: `List de exitosamente`,
          data: listSolicitudes
      });
  }

  export const getestatus = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    
    const solicitud: any = await Solicitudes.findOne({ where: { userId: id } });
    console.log(id, solicitud)
    if(solicitud){
        return res.json({
          msg: `List de exitosamente`,
          data: solicitud.estatusId
      });
    }else{
      return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

function generarHtmlCorreo(contenidoHtml: string): string {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .header {
            background-color: #A9A9A9;
            padding: 20px;
            text-align: center;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px;
            color: #333;
            font-size: 18px;
            font-family: Arial, sans-serif;
          }
          .footer {
            background-color: #eee;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://congresoedomex.gob.mx/storage/images/IMAGOTIPOHorizontal.png" alt="Logo">
        </div>
        <div class="content">
          ${contenidoHtml}
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} SIDerechosHumanos. Todos los derechos reservados.
        </div>
      </body>
    </html>
  `;
}




