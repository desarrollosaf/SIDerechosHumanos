import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import Documentos from './documentos';
import RolUsers from './role_users';
import ValidadorSolicitud from './validadorsolicitud';

class Solicitudes extends Model<
  InferAttributes<Solicitudes>,
  InferCreationAttributes<Solicitudes>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare estatusId: ForeignKey<number>;
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ap_paterno: DataTypes.STRING,
    ap_materno: DataTypes.STRING,
    nombres: DataTypes.STRING,
    correo: DataTypes.STRING,
    celular: DataTypes.STRING,
    curp: DataTypes.STRING,
    cedula_profesional: DataTypes.STRING,
    aviso_privacidad: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: 'solicituds',
    timestamps: true,
    paranoid: true,
  }
);

export default Solicitudes;


Solicitudes.belongsTo(ValidadorSolicitud, { foreignKey: "solicitudId", as: "validasolicitud" });

Solicitudes.hasMany(Documentos, {
  foreignKey: 'solicitudId',
  as: 'documentos',
});

