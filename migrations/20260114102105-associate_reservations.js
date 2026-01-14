'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // referencing reservation to checkout_attempt
    await queryInterface.addColumn('reservation', 'checkoutAttemptId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'checkout_attempt',
        key: 'checkoutAttemptId'
      },
    })

    // referencing reservation to table
    await queryInterface.addColumn('reservation', 'table', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'table',
        key: 'tableId'
      },
    })

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('reservation', 'checkoutAttemptId')
    await queryInterface.removeColumn('reservation', 'table')

  }
};
