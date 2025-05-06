import { DataTypes } from "sequelize";
import sequelize from "../database/connection";


export const Solicitudes = sequelize.define("Solicituds", {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  ap_paterno: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ap_materno: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  nombres: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  celular: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  curp: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cedula_profesional: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  aviso_privacidad: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  tableName: 'Solicituds',
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