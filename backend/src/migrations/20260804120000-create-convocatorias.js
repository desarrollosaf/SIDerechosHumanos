'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('convocatorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      titulo: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      organismo: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cargo_f: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cargo_m: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      fundamento: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      aviso_privacidad_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sede: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      periodo_texto: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('convocatorias');
  }
};
