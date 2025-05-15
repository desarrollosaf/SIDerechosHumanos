'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    // Usuarios a insertar
    const users = [
      { name: 'JISP980721', email: 'nahum.jimenez@congresoedomex.gob.mx', password: hashedPassword },
      { name: 'DIRG940621', email: 'gis.diaz@congresoedomex.gob.mx', password: hashedPassword },
      { name: 'RARC980223', email: 'cesar.rangel@congresoedomex.gob.mx', password: hashedPassword },
      { name: 'DEGC941209', email: 'cesar.desales@congresoedomex.gob.mx', password: hashedPassword },
    ];

    // Inserta usuarios sin retorno de IDs
    await queryInterface.bulkInsert(
      'users',
      users.map(user => ({ ...user, createdAt: new Date(), updatedAt: new Date() }))
    );

    // Obtén los IDs de los usuarios insertados
    const insertedUsers = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email IN (${users.map(u => `'${u.email}'`).join(', ')})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Inserta roles relacionados en rol_users
    await queryInterface.bulkInsert(
      'rol_users',
      insertedUsers.map(user => ({
        user_id: user.id,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rol_users', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
