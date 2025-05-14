import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    IntegerDataType,
  } from 'sequelize';
  import sequelize from '../database/connection';
  import Roles from './role';
  
  class RolUsers extends Model<
    InferAttributes<RolUsers>,
    InferCreationAttributes<RolUsers>
  > {
    declare id: CreationOptional<number>;
    declare role_id: number | null;
    declare user_id: CreationOptional<number>;
  }
  
  RolUsers.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'rol_users',
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
  
  export default RolUsers;
  RolUsers.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
  Roles.hasMany(RolUsers, { foreignKey: 'role_id', as: 'rol_users' });