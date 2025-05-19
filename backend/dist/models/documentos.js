"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
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
        type: sequelize_1.DataTypes.UUID, // Aquí se usa UUID
        allowNull: false,
        references: {
            model: 'solicituds',
            key: 'id',
        },
    },
    tipoDocumento: {
        type: sequelize_1.DataTypes.INTEGER, // Entero, referencia a TipoDocumentos
        allowNull: false,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estatus: {
        type: sequelize_1.DataTypes.NUMBER, // Cambiado a INTEGER
        allowNull: true,
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'documentos',
    timestamps: true,
});
// Relaciones
// Documentos.belongsTo(Solicitudes, { foreignKey: 'solicitudId', as: 'solicitud' });
Documentos.belongsTo(tipodocumentos_1.default, { foreignKey: 'tipoDocumento', as: 'tipo' });
exports.default = Documentos;
