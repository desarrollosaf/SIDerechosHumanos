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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentos = exports.saveDocumentos = void 0;
const models_1 = require("../models");
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
    const solicitud = yield solicitud_1.default.findOne({ where: { userId: 9 } });
    if (!solicitud) {
        res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    const nuevoDocumento = yield models_1.Documentos.create({
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
