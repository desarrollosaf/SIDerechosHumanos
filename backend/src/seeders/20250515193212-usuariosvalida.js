'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Importa uuid

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    // Usuarios a insertar con UUID generado manualmente
    const users = [
      { id: uuidv4(), name: 'JISP980721', email: 'nahum.jimenez@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DIRG940621', email: 'gis.diaz@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'RARC980223', email: 'cesar.rangel@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DEGC941209', email: 'cesar.desales@congresoedomex.gob.mx', password: hashedPassword },
    ];

    // Inserta usuarios con timestamps
    await queryInterface.bulkInsert(
      'users',
      users.map(user => ({ ...user, createdAt: new Date(), updatedAt: new Date() }))
    );

    // Inserta roles usando los UUID ya generados
    
   console.log(users.map(u => u.id)); // Deben ser UUID completos

    await queryInterface.bulkInsert(
      'rol_users',
      users.map(user => ({
        user_id: user.id,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    // Elimina roles y usuarios insertados por este seeder
    await queryInterface.bulkDelete('rol_users', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
