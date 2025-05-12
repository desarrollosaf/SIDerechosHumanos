"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoDocumentos = exports.User = exports.Documentos = exports.Solicitudes = exports.sequelize = void 0;
const connection_1 = __importDefault(require("../database/connection"));
exports.sequelize = connection_1.default;
const solicitud_1 = __importDefault(require("./solicitud"));
exports.Solicitudes = solicitud_1.default;
const documentos_1 = __importDefault(require("./documentos"));
exports.Documentos = documentos_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const tipodocumentos_1 = __importDefault(require("./tipodocumentos"));
exports.TipoDocumentos = tipodocumentos_1.default;
// Definir las asociaciones aquí
solicitud_1.default.hasMany(documentos_1.default, {
    foreignKey: 'solicitudId',
    as: 'documentos',
});
documentos_1.default.belongsTo(solicitud_1.default, {
    foreignKey: 'solicitudId',
    as: 'solicitud',
});
documentos_1.default.belongsTo(tipodocumentos_1.default, {
    foreignKey: 'tipoDocumento', // El campo en Documentos que se conecta
    as: 'tipo' // Alias para facilitar la relación
});
// Opcional: relación entre Solicitudes y User si la tienes
solicitud_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
user_1.default.hasMany(solicitud_1.default, { foreignKey: 'userId' });
