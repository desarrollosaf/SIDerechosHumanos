"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.User = connection_1.default.define("Users", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    email_verified_at: { type: sequelize_1.DataTypes.DATE, unique: true, allowNull: false },
    password: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    remember_token: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
});
