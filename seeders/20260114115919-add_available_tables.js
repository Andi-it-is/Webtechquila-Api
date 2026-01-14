'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.bulkInsert('table', [
      {
        tableId: 1,
        capacity: 8,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 2,
        capacity: 8,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 3,
        capacity: 8,
        premium: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 4,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 5,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 6,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 7,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 8,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 9,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 10,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 11,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 12,
        capacity: 8,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 13,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 14,
        capacity: 6,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 15,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 16,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 17,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 18,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 19,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 20,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 21,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 22,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 23,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 24,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 25,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 26,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 27,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 28,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 29,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 30,
        capacity: 4,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 31,
        capacity: 8,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tableId: 32,
        capacity: 8,
        premium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('table', null, { truncate: true, cascade: true });

  }
};
