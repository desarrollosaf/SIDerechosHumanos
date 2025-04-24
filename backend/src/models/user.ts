import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define("Users", {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    remember_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},
{
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