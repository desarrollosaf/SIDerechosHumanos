"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const solicitud_1 = __importDefault(require("./solicitud"));
const tipodocumentos_1 = __importDefault(require("./tipodocumentos"));
class Documentos extends sequelize_1.Model {
}
Documentos.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    solicitudId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tipoDocumento: {
        type: sequelize_1.DataTypes.INTEGER, // Debe ser entero, referencia a TipoDocumentos
        allowNull: false,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estatus: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'Documentos',
    timestamps: true,
});
exports.default = Documentos;
Documentos.belongsTo(solicitud_1.default, { foreignKey: 'solicitudId', as: 'solicitud' });
Documentos.belongsTo(tipodocumentos_1.default, { foreignKey: 'tipoDocumento', as: 'tipo' });
