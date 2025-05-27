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
exports.getestatus = exports.getSolicitudes = exports.putRegistro = exports.saveRegistro = exports.deleteRegistro = exports.getRegistro = exports.getRegistros = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const solicitud_1 = __importDefault(require("../models/solicitud"));
const user_1 = __importDefault(require("../models/user"));
const role_users_1 = __importDefault(require("../models/role_users"));
const nodemailer = require('nodemailer');
const dotenv_1 = __importDefault(require("dotenv"));
const validadorsolicitud_1 = __importDefault(require("../models/validadorsolicitud"));
dotenv_1.default.config();
const mailer_1 = require("../utils/mailer");
const PDFDocument = require('pdfkit');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    const solicitud = yield user_1.default.findOne({
        where: { email: body.correo }
    });
    if (solicitud) {
        return res.json({ estatus: `400`, correo: solicitud.email });
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
        const token = jsonwebtoken_1.default.sign({
            email: body.correo,
            userId: newUser.id,
        }, process.env.JWT_SECRET || 'sUP3r_s3creT_ClavE-4321!', { expiresIn: '5m' });
        const enlace = `http://localhost:4200/auth/cambiar-contrasena?token=${token}`;
        body.userId = newUser.id;
        body.estatusId = 1;
        yield solicitud_1.default.create(body);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contenido = `
          <h1 class="pcenter">CORREO ELECTRÓNICO PARA EL REGISTRO EXITOSO</h1>
          
          <p><strong>Asunto:</strong> Cuenta creada exitosamente.</p>

          <h3>C. ${body.nombres} ${body.ap_paterno} ${body.ap_materno},</h3>

          <p>Por este medio le informamos que se ha generado de manera exitosa
          su usuario para el proceso de registro. A continuación, 
          se le proporcionan sus credenciales:</p>

          <p>
            <strong>Usuario:</strong> ${body.correo} <br>
            <strong>Contraseña:</strong> <a href="${enlace}">Establecer mi contraseña</a>
          </p>

          <p>Se le recuerda que podrá iniciar su proceso de registro
            a través del micrositio 
            <a href="https://dev5.siasaf.gob.mx/auth/login" target="_blank">
              https://dev5.siasaf.gob.mx/auth/login
            </a> 
            durante el periodo comprendido del XXXXX al XXXXX de XXXXX de 2025.
          </p>

          <p>Agradecemos su atención y quedamos a sus órdenes para cualquier duda o aclaración.</p>

          <p class="pcenter">
            Atentamente, <br>
            <strong>Poder Legislativo del Estado de México</strong>
          </p>

          <p class="pletape" >
            Si tiene problemas para hacer clic en el botón, copie y pegue la siguiente URL en su navegador:<br>
            ${enlace}

          </p>
        `;
                let htmlContent = generarHtmlCorreo(contenido);
                yield (0, mailer_1.sendEmail)(body.correo, 'Tus credenciales de acceso', htmlContent, [{
                        filename: 'oficio.pdf',
                        content: yield generarPDFBuffer({
                            nombreCompleto: `${body.nombres} ${body.ap_paterno} ${body.ap_materno}`,
                            correo: body.correo,
                            password: Upassword,
                        }),
                        contentType: 'application/pdf',
                    }]);
                console.log('Correo enviado correctamente');
            }
            catch (err) {
                console.error('Error al enviar correo:', err);
            }
        }))();
        return res.json({ msg: `Agregado con éxito y correo enviado`, correo: body.correo });
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
const getSolicitudes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, usuario } = req.body;
    const user = yield user_1.default.findOne({
        where: { id: usuario },
        include: [
            {
                model: role_users_1.default,
                as: 'rol_users',
            }
        ]
    });
    const roleId = user.rol_users.role_id;
    let listSolicitudes = [];
    if (user && roleId == 1) {
        listSolicitudes = yield solicitud_1.default.findAll({
            where: {
                estatusId: id
            }
        });
    }
    else {
        listSolicitudes = yield solicitud_1.default.findAll({
            where: {
                estatusId: id,
            },
            include: [
                {
                    model: validadorsolicitud_1.default,
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
});
exports.getSolicitudes = getSolicitudes;
const getestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: id } });
    console.log(id, solicitud);
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
function generarHtmlCorreo(contenidoHtml) {
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
            text-align: center;
          }
          .pletape{
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
function generarPDFBuffer(data) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        doc.fontSize(14).text('Cuenta creada exitosamente', { align: 'center' });
        doc.moveDown();
        doc.text(`Nombre: ${data.nombreCompleto}`);
        doc.text(`Correo electrónico: ${data.correo}`);
        doc.text(`Contraseña generada: ${data.password}`);
        doc.moveDown();
        doc.text('Puede ingresar al micrositio en:');
        doc.text('https://dev5.siasaf.gob.mx/auth/login', { underline: true });
        doc.end();
    });
}
