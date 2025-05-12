'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    /**
     * Add seed commands here.
     *
     * Example:*/
    await queryInterface.bulkInsert('users', [{
      name: 'SAGM990220',
      email: 'martin.sanchez@congresoedomex.gob.mx',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
