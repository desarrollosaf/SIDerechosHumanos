"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class TipoDocumentos extends sequelize_1.Model {
}
TipoDocumentos.init({
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    convocatoria_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    valor: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    valor_real: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: true,
    },
    documento_requerido: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: true,
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    obligatorio: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    max_mb: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'tipodocumentos',
    timestamps: true,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
});
exports.default = TipoDocumentos;
