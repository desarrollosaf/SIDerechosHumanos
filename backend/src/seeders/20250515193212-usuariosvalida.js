'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker'); // Importa faker

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    const users = [
      { id: uuidv4(), name: 'JISP980721', email: 'nahum.jimenez@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DIRG940621', email: 'gis.diaz@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'RARC980223', email: 'cesar.rangel@congresoedomex.gob.mx', password: hashedPassword },
      { id: uuidv4(), name: 'DEGC941209', email: 'cesar.desales@congresoedomex.gob.mx', password: hashedPassword },
    ];

    await queryInterface.bulkInsert(
      'users',
      users.map(user => ({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert(
      'rol_users',
      users.map(user => ({
        user_id: user.id,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert(
      'datos_users',
      users.map(() => ({
        user_id: uuidv4(), // Este se sobreescribirá abajo con el correcto
        nombre: faker.person.firstName(),
        apaterno: faker.person.lastName(),
        amaterno: faker.person.lastName(),
        direccion: faker.location.streetAddress(),
        dependencia: faker.company.name(),
        departamento: faker.commerce.department(),
        cargo: faker.person.jobTitle(),
        createdAt: new Date(),
        updatedAt: new Date()
      })).map((datos, index) => ({
        ...datos,
        user_id: users[index].id // asigna el user_id correcto
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('datos_users', null, {});
    await queryInterface.bulkDelete('rol_users', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
