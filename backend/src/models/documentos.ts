import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import sequelize from '../database/connection';
  
  class Documentos extends Model<
    InferAttributes<Documentos>,
    InferCreationAttributes<Documentos>
  > {
    declare id: CreationOptional<number>;
    declare solicitudId: string | null;
    declare path: string | null;
    declare tipoDocumento: string | null;
    declare estatus: boolean | null;
    declare observaciones: string | null;
  }
  
  Documentos.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      solicitudId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      tipoDocumento: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      estatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Documentos',
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
  
  export default Documentos;
  