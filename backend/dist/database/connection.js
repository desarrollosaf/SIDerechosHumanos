"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('derechos_humanos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
});
// const sequelize = new Sequelize('adminplem_derechos', 'usr_derechos', 'J7Zi5TD4qBctM9', {
//     host: '192.168.36.53',
//     dialect: 'mysql',
//     define: {
//         freezeTableName: true // evita que Sequelize pluralice
//     }
// })
exports.default = sequelize;
