import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  User  from '../models/user'
import  RolUsers  from '../models/role_users'
import  Roles  from '../models/role'
import { Op } from 'sequelize'  
import jwt from 'jsonwebtoken'
import  ValidadorSolicitud  from '../models/validadorsolicitud'
import { sendEmail } from '../utils/mailer';
import  DatosUser  from '../models/datos_user'

export const ReadUser = async (req: Request, res: Response): Promise<any> => {
    const listUser = await User.findAll();
    return res.json({
        msg: `List de categoría encontrada exitosamenteeeee`,
        data: listUser
    });
}



export const CreateUser = async (req: Request, res: Response,  next: NextFunction) => {

    /*const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body  
    console.log(req.body);
    const userEmail = await User.findOne({ where: {  Uemail: Uemail  }})
    const userCredential = await User.findOne({ where: {  Ucredential: Ucredential  }})

    if (userEmail) {
        return next(JSON.stringify({ msg: `Usuario ya existe con el email ${Uemail}`}));
        /*return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        })
    }

    if (userCredential) {
        return next(JSON.stringify({ msg: `Usuario ya existe con la credencial ${Ucredential}`})); 
        /*
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        })
    }

    const UpasswordHash = await bcrypt.hash(Upassword, 10)
    try {
        User.create({
            name: Uname,
            lastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1
        })

        return next(JSON.stringify({ msg: `User ${Uname} ${Ulastname} create success.`}));
        /*res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        })

    } catch (error) {
        return next(JSON.stringify({ msg: `Existe un error al crear el usuario => `, error}));
        /*res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        })
    }*/
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction):  Promise<any> => {
    const { email, password } = req.body;

    console.log(req.body);

    const user: any = await User.findOne({ 
        where: { email: email },
        include: [
        {
            model: RolUsers,
            as: 'rol_users',
            include: [
            {
                model: Roles,
                as: 'role'
            }
            ]
        }
        ]
    })
    console.log(user)
    if (!user) {
        //return next(JSON.stringify({ msg: `Usuario no existe con el email ${email}`}));
        return res.status(400).json({
            msg: `Usuario no existe con el email ${email}`
        })
    }

    
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
        //return next(JSON.stringify({ msg: `Password Incorrecto => ${password}`}));
        return res.status(400).json({
            msg: `Password Incorrecto => ${password}`
        })
    }

    const token = jwt.sign({
        email: email
    }, process.env.SECRET_KEY || 'TSE-Poder-legislativo',
    { expiresIn: 10000 }
    );
    
    return res.json({ token,user })
}

export const getvalidadores = async (req: Request, res: Response): Promise<any> => {
    const user: any = await User.findAll({ 
    attributes: ['id', 'name'], 
        include: [
            {
            model: RolUsers,
            as: 'rol_users',
            where: { role_id: 2 },
            attributes: [] 
            }
        ]
    });

    if(user){
        return res.json({
          msg: `List de exitosamente`,
          data: user
      });
    }
}

export const updatevalidador = async (req: Request, res: Response): Promise<any> => {
      const { usuario, solicitud } = req.body;

    const validasolicitudes = await ValidadorSolicitud.findOne({
        where: { solicitudId: solicitud },
    });
    

    if(validasolicitudes){
        validasolicitudes.validadorId = usuario;
        await validasolicitudes.save();
        return res.json("200");
    }else{
        return res.status(404).json({
            msg: `No existe el id ${solicitud}`,
        });
    }
    
      
}

export const saveValidador = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;

  function generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  const solicitud = await User.findOne({
    where: { email: body.correo }  
  });

  if(solicitud){
    return res.json({ estatus: `400`, correo: solicitud.email } );
  }

  try {
    const Upassword = generateRandomPassword(12);
    const UpasswordHash = await bcrypt.hash(Upassword, 10);
    const newUser = await User.create({
      name: body.curp,
      email: body.correo,
      password: UpasswordHash,
      rol_users: {
        role_id: 2,  
      },
    }, {
      include: [{ model: RolUsers, as: 'rol_users' }],
    });

    body.user_id = newUser.id;
    await DatosUser.create(body);
    
    (async () => {
      try {
        const contenido = `
          <h1 class="pcenter">CORREO ELECTRÓNICO PARA ACCESOS AL SISTEMA</h1>
          
          <p><strong>Asunto:</strong> Cuenta creada exitosamente.</p>

          <h3>C. ${body.nombre} ${body.apaterno} ${body.amaterno},</h3>

          <p>Por este medio le informamos que se ha generado de manera exitosa
          su usuario para que pueda validar las solicitudes. A continuación, 
          se le proporcionan sus credenciales:</p>

          <p>
            <strong>Usuario:</strong> ${body.correo} <br>
            <strong>Contraseña:</strong> ${Upassword}
          </p>

          <p>Se le recuerda que podrá iniciar su proceso de registro
            a través del micrositio 
            <a href="https://dev5.siasaf.gob.mx/auth/login" target="_blank">
              https://dev5.siasaf.gob.mx/auth/login
            </a> 
            durante el periodo comprendido del XXXXX al XXXXX de XXXXX de 2025.
          </p>

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

    return res.json({ msg: `Agregado con éxito y correo enviado`, correo: body.correo } );

  } catch (error) {
    
    console.error(error);
    return res.status(500).json({ msg: `Ocurrió un error al registrar` });
  }
};

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
          .pcenter{
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img 
            src="https://congresoedomex.gob.mx/storage/images/congreso.jpg" 
            alt="Logo"
            style="display: block; margin: 0 auto; width: 300px; height: auto;"
          >
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