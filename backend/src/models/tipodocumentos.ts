import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';

class TipoDocumentos extends Model<
  InferAttributes<TipoDocumentos>,
  InferCreationAttributes<TipoDocumentos>
> {
  declare id: CreationOptional<number>;
  declare convocatoria_id: ForeignKey<number>;
  declare valor: string | null;
  /** Requisito legal que acredita el documento; se muestra en negritas. */
  declare valor_real: string | null;
  /** Nombre del archivo que debe cargar la persona aspirante. */
  declare documento_requerido: string | null;
  declare orden: CreationOptional<number>;
  declare obligatorio: CreationOptional<boolean>;
  declare max_mb: CreationOptional<number>;
}

TipoDocumentos.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    convocatoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    valor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    valor_real: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    documento_requerido: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    obligatorio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    max_mb: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15,
    },
  },
  {
    sequelize,
    tableName: 'tipodocumentos',
    timestamps: true,
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

export default TipoDocumentos;
