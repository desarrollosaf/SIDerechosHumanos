"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Documentos extends sequelize_1.Model {
}
Documentos.init({
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    solicitudId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    path: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    tipoDocumento: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    estatus: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'Documentos',
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
exports.default = Documentos;
