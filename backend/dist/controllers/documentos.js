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
const saveDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivo = req.file; // contiene el archivo subido
    const { tipo, usuario } = req.body;
    if (!archivo) {
        res.status(400).json({ message: 'Archivo no recibido' });
    }
    /*console.log('Archivo guardado en:', archivo?.path);
    console.log('Nombre original:', archivo?.originalname);
    console.log('Nombre actual:', archivo?.filename);
    console.log('Tipo de documento:', tipo);
    console.log('Usuario:', usuario);*/
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: 2 } });
    if (!solicitud) {
        res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const nuevoDocumento = yield documentos_1.default.create({
        solicitudId: solicitud.id,
        path: `storage/${usuario}/${archivo === null || archivo === void 0 ? void 0 : archivo.filename}`,
        tipoDocumento: 1,
    });
    res.status(201).json({
        message: 'Documento guardado exitosamente',
        documento: nuevoDocumento
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
        res.json(solicitudConDocumentos);
    }
    else {
        res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
});
exports.getDocumentos = getDocumentos;
