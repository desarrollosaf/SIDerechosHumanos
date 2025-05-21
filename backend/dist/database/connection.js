"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('derechos_humanos', 'homestead', 'secret', {
    host: '192.168.10.10',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
});
exports.default = sequelize;
