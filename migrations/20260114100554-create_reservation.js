'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('reservation', {

      reservationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      guests: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      prefferedSeat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerNote: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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

    await queryInterface.dropTable('reservation', {
      force: true,
      cascade: true
    })
  }
};
