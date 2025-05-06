'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Solicituds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
      },
      ap_paterno: {
        type: Sequelize.STRING
      },
      ap_materno: {
        type: Sequelize.STRING
      },
      nombres: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      celular: {
        type: Sequelize.STRING
      },
      curp: {
        type: Sequelize.STRING
      },
      cedula_profesional: {
        type: Sequelize.STRING
      },
      aviso_privacidad: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Solicituds');
  }
};