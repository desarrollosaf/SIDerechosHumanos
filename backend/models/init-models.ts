import type { Sequelize } from "sequelize";
import { SequelizeMeta as _SequelizeMeta } from "./SequelizeMeta";
import type { SequelizeMetaAttributes, SequelizeMetaCreationAttributes } from "./SequelizeMeta";
import { Users as _Users } from "./Users";
import type { UsersAttributes, UsersCreationAttributes } from "./Users";

export {
  _SequelizeMeta as SequelizeMeta,
  _Users as Users,
};

export type {
  SequelizeMetaAttributes,
  SequelizeMetaCreationAttributes,
  UsersAttributes,
  UsersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const SequelizeMeta = _SequelizeMeta.initModel(sequelize);
  const Users = _Users.initModel(sequelize);


  return {
    SequelizeMeta: SequelizeMeta,
    Users: Users,
  };
}
