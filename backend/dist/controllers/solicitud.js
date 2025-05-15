"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getestatus = exports.getsolicitudes = exports.putRegistro = exports.saveRegistro = exports.deleteRegistro = exports.getRegistro = exports.getRegistros = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const solicitud_1 = __importDefault(require("../models/solicitud"));
const user_1 = __importDefault(require("../models/user"));
const role_users_1 = __importDefault(require("../models/role_users"));
const nodemailer = require('nodemailer');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getRegistros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listSolicitudes = yield solicitud_1.default.findAll();
    return res.json({
        msg: `List de exitosamente`,
        data: listSolicitudes
    });
});
exports.getRegistros = getRegistros;
const getRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findByPk(id);
    if (solicitud) {
        return res.json(solicitud);
    }
    else {
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
});
exports.getRegistro = getRegistro;
const deleteRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findByPk(id);
    if (solicitud) {
        yield solicitud.destroy();
        return res.json({
            msg: `Eliminado con exito`,
        });
    }
    else {
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
});
exports.deleteRegistro = deleteRegistro;
const saveRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    function generateRandomPassword(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    try {
        const Upassword = generateRandomPassword(12);
        const UpasswordHash = yield bcrypt_1.default.hash(Upassword, 10);
        const newUser = yield user_1.default.create({
            name: body.curp,
            email: body.correo,
            password: UpasswordHash,
            rol_users: {
                role_id: 3,
            },
        }, {
            include: [{ model: role_users_1.default, as: 'rol_users' }],
        });
        console.log(newUser.id);
        body.userId = newUser.id;
        body.estatusId = 1;
        console.log(body);
        yield solicitud_1.default.create(body);
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
        yield transporter.sendMail({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `Ocurrió un error al registrar` });
    }
});
exports.saveRegistro = saveRegistro;
const putRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.putRegistro = putRegistro;
const getsolicitudes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const listSolicitudes = yield solicitud_1.default.findAll({
        where: {
            estatusId: id
        }
    });
    return res.json({
        msg: `List de exitosamente`,
        data: listSolicitudes
    });
});
exports.getsolicitudes = getsolicitudes;
const getestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: id } });
    if (solicitud) {
        return res.json({
            msg: `List de exitosamente`,
            data: solicitud.estatusId
        });
    }
    else {
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
});
exports.getestatus = getestatus;
