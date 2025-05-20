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
const mailer_1 = require("../utils/mailer");
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
        if (fs_1.default.existsSync(documentoPath)) {
            fs_1.default.unlinkSync(documentoPath);
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
                    }
                ],
            },
        ],
        // attributes: ['id'],
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
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: id } });
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
    yield validadorsolicitud_1.default.create({
        solicitudId: solicitud.id,
        validadorId: validadorConMenosSolicitudes.user_id,
    });
    solicitud.estatusId = 2;
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
    var _a;
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
            const tipoValor = (_a = documentoExistente.tipo) === null || _a === void 0 ? void 0 : _a.valor;
            const documentoEntrada = Documentos2.find((doc) => doc.nombre === tipoValor);
            if (documentoEntrada && tipoValor) {
                documentoExistente.estatus = 3;
                documentoExistente.observaciones = documentoEntrada.observaciones || '';
                observados.push({ tipo: tipoValor, observaciones: documentoEntrada.observaciones || '' });
            }
            else {
                documentoExistente.estatus = 2;
            }
            yield documentoExistente.save();
        }
        const usuario = solicitud.usuario;
        const emailDestino = usuario === null || usuario === void 0 ? void 0 : usuario.email;
        if (!emailDestino) {
            console.warn('No se encontró email del usuario');
        }
        else {
            if (observados.length > 0) {
                const contenido = observados.map(o => `- ${o.tipo}: ${o.observaciones}`).join('\n');
                yield (0, mailer_1.sendEmail)(emailDestino, 'Revisión de documentos', `Se observaron los siguientes documentos:\n\n${contenido}`);
                solicitud.estatusId = 4;
                yield solicitud.save();
            }
            else {
                yield (0, mailer_1.sendEmail)(emailDestino, 'Revisión de documentos', 'Todos tus documentos fueron revisados y están correctos.');
                solicitud.estatusId = 3;
                yield solicitud.save();
            }
        }
        return res.status(200).json({ message: 'Documentos actualizados correctamente.' });
    }
    catch (error) {
        console.error('Error al actualizar documentos:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
exports.estatusDoc = estatusDoc;
