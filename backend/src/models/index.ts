import sequelize from '../database/connection';
import Solicitudes from './solicitud';
import Documentos from './documentos';
import User from './user';
import TipoDocumentos from './tipodocumentos';

// Definir las asociaciones aquí
Solicitudes.hasMany(Documentos, {
  foreignKey: 'solicitudId',
  as: 'documentos',
});

/*Documentos.belongsTo(Solicitudes, {
  foreignKey: 'solicitudId',
  as: 'solicitud',
});*/



// Opcional: relación entre Solicitudes y User si la tienes
Solicitudes.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Solicitudes, { foreignKey: 'userId' });

// Exportar todos los modelos para usar en otras partes de la app
export {
  sequelize,
  Solicitudes,
  Documentos,
  User,
  TipoDocumentos,
};