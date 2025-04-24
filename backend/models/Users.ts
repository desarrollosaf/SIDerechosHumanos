import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UsersAttributes {
  id: number;
  name?: string;
  email?: string;
  email_verified_at?: Date;
  password?: string;
  remember_token?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UsersPk = "id";
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes = "id" | "name" | "email" | "email_verified_at" | "password" | "remember_token" | "createdAt" | "updatedAt";
export type UsersCreationAttributes = Optional<UsersAttributes, UsersOptionalAttributes>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
  id!: number;
  name?: string;
  email?: string;
  email_verified_at?: Date;
  password?: string;
  remember_token?: string;
  createdAt!: Date;
  updatedAt!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    return Users.init({
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
    }, {
      sequelize,
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
  }
}
