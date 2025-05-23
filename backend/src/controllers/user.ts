import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  User  from '../models/user'
import  RolUsers  from '../models/role_users'
import  Roles  from '../models/role'
import { Op } from 'sequelize'  
import jwt from 'jsonwebtoken'
import  ValidadorSolicitud  from '../models/validadorsolicitud'

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
        await solicitud.save();
        return res.json("200");
    }else{
        return res.status(404).json({
            msg: `No existe el id ${solicitud}`,
        });
    }
    
      
}