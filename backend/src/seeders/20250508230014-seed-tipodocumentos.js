'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipodocumentos', [
      { valor: 'curp', valor_real: 'CURP', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'ine', valor_real: 'INE', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'titulo_licenciatura', valor_real: 'TITULO DE LICENCIATURA', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'acta_nacimiento', valor_real: 'ACTA DE NACIMIENTO', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_ant_no_penales', valor_real: 'CARTA ANTECEDENTES NO PENALES', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta1', valor_real: 'CARTA PROTESTA 1', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta2', valor_real: 'CARTA PROTESTA 2', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta3', valor_real: 'CARTA PROTESTA 3', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta4', valor_real: 'CARTA PROTESTA 4', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta5', valor_real: 'CARTA PROTESTA 5', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'curriculum', valor_real: 'CURRICULUM',  createdAt: new Date(), updatedAt: new Date() },
      { valor: 'propuesta_programa', valor_real: 'PROPUESTA PROGRAMA', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'copia_certificada', valor_real: 'COPIA CERTIFICADA', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipodocumentos', null, {});
  }
};
