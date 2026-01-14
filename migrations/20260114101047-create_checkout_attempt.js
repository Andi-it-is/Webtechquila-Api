'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('checkout_attempt', {

      checkoutAttemptId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },

      isEmailConfirmed: {
        type: Sequelize.BOOLEAN,
      },
      expiresAt: {
        type: Sequelize.DATE,
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

    await queryInterface.dropTable('checkout_attempt', {
      force: true,
      cascade: true
    })
  }

};
