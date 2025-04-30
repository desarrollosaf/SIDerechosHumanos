"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solicitudes = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Solicitudes = connection_1.default.define("solicituds", {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    ap_paterno: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    ap_materno: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    nombres: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    correo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    celular: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    curp: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    cedula_profesional: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    aviso_privacidad: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'solicituds',
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
                { name: "id" },
            ]
        },
    ]
});
