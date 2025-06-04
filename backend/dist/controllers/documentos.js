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
exports.estatusDoc = exports.deleteDoc = exports.envSolicitud = exports.getDocumentos = exports.saveDocumentos = void 0;
const solicitud_1 = __importDefault(require("../models/solicitud"));
const documentos_1 = __importDefault(require("../models/documentos"));
const tipodocumentos_1 = __importDefault(require("../models/tipodocumentos"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const role_users_1 = __importDefault(require("../models/role_users"));
const validadorsolicitud_1 = __importDefault(require("../models/validadorsolicitud"));
const user_1 = __importDefault(require("../models/user"));
const datos_user_1 = __importDefault(require("../models/datos_user"));
const mailer_1 = require("../utils/mailer");
const detalle_fecha_1 = __importDefault(require("../models/detalle_fecha"));
const PDFDocument = require('pdfkit');
const saveDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivo = req.file;
    const { tipo, usuario } = req.body;
    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no recibido' });
    }
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: usuario } });
    if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const documentoExistente = yield documentos_1.default.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: tipodocumentos_1.default,
                as: 'tipo',
                where: { valor: tipo },
                attributes: []
            }
        ]
    });
    let documentoGuardado;
    const tipo1 = yield tipodocumentos_1.default.findOne({
        where: { valor: tipo }
    });
    if (!tipo1) {
        return res.status(404).json({ message: 'Tipo de documento no encontrado' });
    }
    if (documentoExistente) {
        const documentoPath = path_1.default.resolve(documentoExistente.path);
        if (documentoExistente.path != '') {
            if (fs_1.default.existsSync(documentoPath)) {
                fs_1.default.unlinkSync(documentoPath);
            }
        }
        documentoExistente.path = `storage/${usuario}/${archivo.filename}`;
        documentoExistente.estatus = 1;
        yield documentoExistente.save();
        documentoGuardado = documentoExistente;
    }
    else {
        documentoGuardado = yield documentos_1.default.create({
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
});
exports.saveDocumentos = saveDocumentos;
const getDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitudConDocumentos = yield solicitud_1.default.findOne({
        where: { userId: id },
        include: [
            {
                model: documentos_1.default,
                as: 'documentos',
                include: [
                    {
                        model: tipodocumentos_1.default,
                        as: 'tipo',
                        attributes: ['valor'],
                    },
                ],
            },
            {
                model: validadorsolicitud_1.default,
                as: 'validasolicitud',
                include: [
                    {
                        model: user_1.default,
                        as: 'validador',
                        include: [
                            {
                                model: datos_user_1.default,
                                as: 'datos_user',
                            }
                        ]
                    },
                ],
            },
        ],
        logging: console.log,
    });
    if (solicitudConDocumentos) {
        return res.json(solicitudConDocumentos);
    }
    else {
        return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
});
exports.getDocumentos = getDocumentos;
const envSolicitud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findOne({
        where: { userId: id },
        include: [
            {
                model: user_1.default,
                as: 'usuario',
                attributes: ['email'],
            },
        ],
    });
    if (!solicitud) {
        return res.status(404).json({ msg: `No existe el id ${id}` });
    }
    const validadores = yield role_users_1.default.findAll({ where: { role_id: 2 } });
    if (validadores.length === 0) {
        return res.status(400).json({ msg: "No hay validadores disponibles" });
    }
    const validadorConMenosSolicitudes = yield Promise.all(validadores.map((validador) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield validadorsolicitud_1.default.count({ where: { validadorId: validador.user_id } });
        return { validador, count };
    }))).then((results) => results.sort((a, b) => a.count - b.count)[0].validador);
    const existsolicitud = yield validadorsolicitud_1.default.findOne({ where: { solicitudId: solicitud.id } });
    if (!existsolicitud) {
        yield validadorsolicitud_1.default.create({
            solicitudId: solicitud.id,
            validadorId: validadorConMenosSolicitudes.user_id,
        });
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const meses = [
                    "enero", "febrero", "marzo", "abril", "mayo", "junio",
                    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
                ];
                const hoy = new Date();
                const fechaFormateada = `Toluca de Lerdo, México; a ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}.`;
                const contenido = `
                  <div class="container">
                  <p  class="pderecha" >${fechaFormateada}</p>
                  <h3><trong>C.</strong> ${solicitud.nombres} ${solicitud.ap_paterno} ${solicitud.ap_materno},</h3>
                  <p>Por este medio le informamos que su registro electrónico ha sido concluido
                   de manera satisfactoria. Es importante señalar que este correo únicamente
                    confirma la recepción de su registro y documentación en el sistema, pero
                     no constituye una garantía de que los documentos cargados cumplan con
                      los requisitos establecidos en los artículos 89, fracción II, inciso a),
                       91 y 107 de la Constitución Política del Estado Libre y Soberano de México.
                        Tampoco se emite pronunciamiento alguno sobre el contenido o idoneidad
                         de los archivos recibidos.
                  </p>
                  <p>Asimismo, se le informa que en el archivo adjunto a este correo podrá
                   descargar el acuse de envío de información, así como el folio asignado al trámite correspondiente.</p>
                  <p>Le recordamos que deberá mantenerse atento a cualquier comunicación adicional que se enviará
                   al correo electrónico proporcionado durante el proceso de registro.</p>
                  <p>
                  Agradecemos su atención y quedamos a sus órdenes para cualquier duda o aclaración.
                  </p>
                   <p>Atentamente,<br><strong>Poder Legislativo del Estado de México</strong></p>
                </div>
              `;
                let htmlContent = generarHtmlCorreo(contenido);
                yield (0, mailer_1.sendEmail)(solicitud.usuario.email, 'Registro Electronico Satisfactorio', htmlContent, [{
                        filename: 'oficio.pdf',
                        content: yield generarPDFBuffer({
                            nombreCompleto: `${solicitud.nombres} ${solicitud.ap_paterno} ${solicitud.ap_materno}`,
                            correo: solicitud.correo,
                        }),
                        contentType: 'application/pdf',
                    }]);
                console.log('Correo enviado correctamente');
            }
            catch (err) {
                console.error('Error al enviar correo:', err);
            }
        }))();
    }
    solicitud.estatusId = 2;
    solicitud.fecha_envio = new Date();
    yield solicitud.save();
    return res.json("200");
});
exports.envSolicitud = envSolicitud;
const deleteDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, usuario } = req.body;
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: usuario } });
    const documentoExistente = yield documentos_1.default.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: tipodocumentos_1.default,
                as: 'tipo',
                where: { valor: tipo },
                attributes: []
            }
        ]
    });
    if (documentoExistente) {
        const documentoPath = path_1.default.resolve(documentoExistente.path);
        if (fs_1.default.existsSync(documentoPath)) {
            fs_1.default.unlinkSync(documentoPath);
        }
        const existsolicitud = yield validadorsolicitud_1.default.findOne({ where: { solicitudId: solicitud.id } });
        if (existsolicitud) {
            documentoExistente.path = '';
            yield documentoExistente.save();
        }
        else {
            yield documentos_1.default.destroy({
                where: {
                    tipoDocumento: documentoExistente.tipoDocumento
                }
            });
        }
        return res.json('200');
    }
    else {
        return res.status(404).json({
            msg: `No existe el documento con el tipo y solicitud${usuario}`,
        });
    }
});
exports.deleteDoc = deleteDoc;
const estatusDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const Documentos2 = req.body;
        const solicitud = yield solicitud_1.default.findOne({
            where: { userId },
            include: [
                {
                    model: user_1.default,
                    as: 'usuario',
                    attributes: ['email'],
                },
            ],
        });
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        const documentosExistentes = yield documentos_1.default.findAll({
            where: { solicitudId: solicitud.id },
            include: [{ model: tipodocumentos_1.default, as: 'tipo' }]
        });
        const observados = [];
        for (const documentoExistente of documentosExistentes) {
            const tipo1 = documentoExistente.tipo;
            const tipoValor = tipo1 === null || tipo1 === void 0 ? void 0 : tipo1.valor;
            const doc = tipo1 === null || tipo1 === void 0 ? void 0 : tipo1.valor_real;
            const documentoEntrada = Documentos2.find((doc) => doc.nombre === tipoValor);
            if (documentoEntrada && tipoValor) {
                documentoExistente.estatus = 3;
                documentoExistente.observaciones = documentoEntrada.observaciones || '';
                observados.push({ tipo: doc !== null && doc !== void 0 ? doc : '', observaciones: documentoEntrada.observaciones || '' });
            }
            else {
                documentoExistente.estatus = 2;
            }
            yield documentoExistente.save();
        }
        // Actualiza estatus
        if (observados.length > 0) {
            yield detalle_fecha_1.default.create({
                solicitud_id: solicitud.id,
                fecha: new Date(),
            });
        }
        else {
            solicitud.fecha_validacion = new Date();
        }
        solicitud.estatusId = observados.length > 0 ? 4 : 3;
        yield solicitud.save();
        // ENVÍO ASÍNCRONO DEL CORREO
        const usuario = solicitud.usuario;
        const emailDestino = usuario === null || usuario === void 0 ? void 0 : usuario.email;
        if (emailDestino) {
            // Ejecuta sin bloquear
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let htmlContent;
                    if (observados.length > 0) {
                        const tablaObservados = `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
                <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="text-align: left;">Documento</th>
                    <th style="text-align: left;">Observación</th>
                </tr>
                </thead>
                <tbody>
                ${observados.map(o => `
                    <tr>
                    <td>${o.tipo}</td>
                    <td>${o.observaciones}</td>
                    </tr>
                `).join('')}

                </tbody>
            </table>`;
                        const meses = [
                            "enero", "febrero", "marzo", "abril", "mayo", "junio",
                            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
                        ];
                        const hoy = new Date();
                        const fechaFormateada = `Toluca de Lerdo, México; a ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}.`;
                        const contenido = `
              <div class="container">
              <p  class="pderecha" >${fechaFormateada}</p>
              <h3><trong>C.</strong> ${solicitud.nombres} ${solicitud.ap_paterno} ${solicitud.ap_materno},</h3>
              <p><strong>Folio:</strong> ${solicitud.id.slice(0, 8)}</p>
              <p>Por este medio se le informa que, tras la revisión realizada en el portal
               de registro respecto de su solicitud, se ha determinado que el registro es NO PROCEDENTE. <br>
               
               A continuación, se detallan las observaciones encontradas:</p>
               ${tablaObservados}
               <p>Es importante mencionarle que puede subsanar dichas observaciones en un plazo no mayor
                a XXXX horas naturales contadas a partir de la recepción de este correo.
                En caso de no realizarlo en dicho plazo, se considerará no cumplimentada
                la acreditación de los requisitos de elegibilidad. <br><br>
                
                Para estos efectos, se habilitará la sección correspondiente en la página de
                registro para que pueda cargar los documentos requeridos. Dichos campos estarán
                disponibles solo durante doce horas, y posterior a ese tiempo,
                se cerrarán nuevamente, sin posibilidad de modificación. <br><br>

                Para enviar la documentación corregida, por favor, ingrese
                a la cuenta registrada y diríjase al campo de documentación,
                en donde podrá sustituir el archivo correspondiente. <br><br>
                
                Agradecemos su pronta atención a este asunto. Si tiene alguna duda o requiere asistencia
                adicional, no dude en ponerse en contacto con nosotros.</p>
                <p>Atentamente,<br><strong>Poder Legislativo del Estado de México</strong></p>
              </div>
            `;
                        htmlContent = generarHtmlCorreo(contenido);
                        yield (0, mailer_1.sendEmail)(emailDestino, 'Revisión de documentos', htmlContent);
                    }
                }
                catch (correoError) {
                    console.error('Error al enviar correo:', correoError);
                }
            }))();
        }
        else {
            console.warn('No se encontró email del usuario');
        }
        // Respondemos al cliente sin esperar el correo
        return res.status(200).json({ message: 'Documentos actualizados correctamente.' });
    }
    catch (error) {
        console.error('Error al actualizar documentos:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
exports.estatusDoc = estatusDoc;
function generarHtmlCorreo(contenidoHtml) {
    return `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          p {
            color: #4d4d4d;
            font-size: 16px;
            line-height: 1.5;
          }
          .credentials {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 30px;
            text-align: center;
          }
          .pderecha{
          text-align: right;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img 
            src="https://congresoedomex.gob.mx/storage/images/IMAGOTIPOHorizontal.png" 
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
        doc.moveDown();
        doc.text('Puede ingresar al micrositio en:');
        doc.end();
    });
}
