import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import User from '../models/user'

class Solicitudes extends Model<
  InferAttributes<Solicitudes>,
  InferCreationAttributes<Solicitudes>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare ap_paterno: string | null;
  declare ap_materno: string | null;
  declare nombres: string | null;
  declare correo: string | null;
  declare celular: string | null;
  declare curp: string | null;
  declare cedula_profesional: string | null;
  declare aviso_privacidad: boolean | null;
}

Solicitudes.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nombre real de la tabla
        key: 'id',
      },
    },
    ap_paterno: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ap_materno: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    celular: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    curp: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cedula_profesional: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    aviso_privacidad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Solicituds',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
    ],
  }
);

// Opcional: establecer asociación
Solicitudes.belongsTo(User, { foreignKey: 'userId' });

export default Solicitudes;