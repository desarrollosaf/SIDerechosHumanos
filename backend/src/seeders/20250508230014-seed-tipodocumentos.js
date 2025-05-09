'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TipoDocumentos', [
      { valor: 'curp', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'ine', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'titulo_licenciatura', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'acta_nacimiento', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_ant_no_penales', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta1', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta2', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta3', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta4', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta5', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'curriculum', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'propuesta_programa', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'copia_certificada', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipodocumentos', null, {});
  }
};
