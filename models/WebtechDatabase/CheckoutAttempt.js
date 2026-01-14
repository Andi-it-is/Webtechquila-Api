const sequelize = require('sequelize')
const db = require('../index')
const reservation = require('./Reservation');

const checkoutAttempt = db.define("checkout_attempt", {

  // primary key
  checkoutAttemptId: {
    type: sequelize.UUID,
    primaryKey: true,
  },

  // boolean to determine if this checkout attempt was confirmed via a 2FA e-mail confirmation process
  isEmailConfirmed: {
    type: sequelize.BOOLEAN,
  },
  expiresAt: {
    type: sequelize.DATE,
  },

  // default Columns
  createdAt: {
    type: sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: sequelize.DATE,
    allowNull: false,
  }

}, {
  tableName: "checkout_attempt",

});


checkoutAttempt.associate = function (models) {
  checkoutAttempt.hasOne(reservation, {
    foreignKey: 'reservationId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
}

module.exports = checkoutAttempt