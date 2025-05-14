import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import sequelize from '../database/connection';
import RolUsers from './role_users';
  
  class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare id: CreationOptional<number>;
    declare name: string | null;
    declare email: string | null;
    declare email_verified_at: Date | null;
    declare password: string | null;
    declare remember_token: string | null;
    declare rol_users?: {role_id: number;};
  }
  
  // Inicializamos el modelo
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remember_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
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
  
  export default User;

User.hasOne(RolUsers, { foreignKey: 'user_id', as: 'rol_users' });
RolUsers.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
