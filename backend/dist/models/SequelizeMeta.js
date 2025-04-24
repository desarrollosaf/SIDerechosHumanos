"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeMeta = void 0;
const sequelize_1 = require("sequelize");
class SequelizeMeta extends sequelize_1.Model {
    static initModel(sequelize) {
        return SequelizeMeta.init({
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                primaryKey: true
            }
        }, {
            sequelize,
            tableName: 'SequelizeMeta',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "name" },
                    ]
                },
                {
                    name: "name",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "name" },
                    ]
                },
            ]
        });
    }
}
exports.SequelizeMeta = SequelizeMeta;
