"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.User = connection_1.default.define("Users", {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    email_verified_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    remember_token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'Users',
    timestamps: true,
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
