import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import Solicitudes from './solicitud';
import TipoDocumentos from './tipodocumentos';

class Documentos extends Model<
  InferAttributes<Documentos>,
  InferCreationAttributes<Documentos>
> {
  declare id: CreationOptional<number>;
  declare solicitudId: ForeignKey<number>;
  declare tipoDocumento: number;
  declare path: string;
  declare estatus: boolean | null;
  declare observaciones: string | null;

  // ✅ Relación tipo, que es opcional
  declare tipo?: {
    valor: string;
  };
}

Documentos.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    solicitudId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoDocumento: {
      type: DataTypes.INTEGER, // Debe ser entero, referencia a TipoDocumentos
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'documentos',
    timestamps: true,
  }
);

export default Documentos;
// Documentos.belongsTo(Solicitudes, { foreignKey: 'solicitudId', as: 'solicitud' });
Documentos.belongsTo(TipoDocumentos, {foreignKey: 'tipoDocumento', as: 'tipo' });