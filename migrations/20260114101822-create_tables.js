'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('table', {

      tableId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      capacity: {
        type: Sequelize.INTEGER,
      },
      premium: {
        type: Sequelize.BOOLEAN,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('table', {
      force: true,
      cascade: true
    })
  }
};
