"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.SequelizeMeta = void 0;
exports.initModels = initModels;
const SequelizeMeta_1 = require("./SequelizeMeta");
Object.defineProperty(exports, "SequelizeMeta", { enumerable: true, get: function () { return SequelizeMeta_1.SequelizeMeta; } });
const Users_1 = require("./Users");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return Users_1.Users; } });
function initModels(sequelize) {
    const SequelizeMeta = SequelizeMeta_1.SequelizeMeta.initModel(sequelize);
    const Users = Users_1.Users.initModel(sequelize);
    return {
        SequelizeMeta: SequelizeMeta,
        Users: Users,
    };
}
