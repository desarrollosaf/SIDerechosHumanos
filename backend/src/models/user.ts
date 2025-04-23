import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define("Users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    email_verified_at: { type: DataTypes.DATE, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, unique: true, allowNull: false },
    remember_token: { type: DataTypes.STRING, unique: true, allowNull: false },
});