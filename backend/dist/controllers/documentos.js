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
exports.getDocumentos = exports.saveDocumentos = void 0;
const solicitud_1 = __importDefault(require("../models/solicitud"));
const documentos_1 = __importDefault(require("../models/documentos"));
const tipodocumentos_1 = __importDefault(require("../models/tipodocumentos"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const saveDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivo = req.file; // contiene el archivo subido
    const { tipo, usuario } = req.body;
    if (!archivo) {
        return res.status(400).json({ message: 'Archivo no recibido' });
    }
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: usuario } });
    if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    // Verificar si ya existe un documento de ese tipo para la solicitud
    const documentoExistente = yield documentos_1.default.findOne({
        where: { solicitudId: solicitud.id },
        include: [
            {
                model: tipodocumentos_1.default,
                as: 'tipo',
                where: { valor: tipo },
                attributes: [] // No traer campos de TipoDocumentos, solo filtrar
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
        // Verificar si el archivo existe y eliminarlo
        if (fs_1.default.existsSync(documentoPath)) {
            fs_1.default.unlinkSync(documentoPath);
        }
        // Actualizar el documento existente
        documentoExistente.path = `storage/${usuario}/${archivo.filename}`;
        yield documentoExistente.save();
        documentoGuardado = documentoExistente;
    }
    else {
        // Crear un nuevo documento si no existe
        documentoGuardado = yield documentos_1.default.create({
            solicitudId: solicitud.id,
            path: `storage/${usuario}/${archivo.filename}`,
            tipoDocumento: tipo1.id, // Asegúrate de que este valor sea un ID correcto
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
        attributes: ['id'],
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
