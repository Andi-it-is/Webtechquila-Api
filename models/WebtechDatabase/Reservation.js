const sequelize = require('sequelize')
const db = require('../index')
const checkoutAttempt = require('./CheckoutAttempt');

const reservation = db.define("reservation", {

  // primary key
  reservationId: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // amount of guests that a reservation has
  guests: {
    type: sequelize.INTEGER,
  },
  // date at which the reservation is taking
  date: {
    type: sequelize.DATEONLY,
    allowNull: false,
  },
  // time at which the reservation is taking
  time: {
    type: sequelize.TIME,
    allowNull: false,
  },
  // bool to determine if the user wished to make his own seat reservation
  prefferedSeat: {
    type: sequelize.BOOLEAN,
    allowNull: false,
  },
  /**
   * * Section with personal informations. 
   * * Informations are nullable, if offline-taken reservations are made via this software. 
   */
  // firstname from the user who made the reservation
  firstName: {
    type: sequelize.STRING,
    allowNull: true,
  },
  lastName: {
    type: sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: sequelize.STRING,
    allowNull: true,
  },
  tel: {
    type: sequelize.STRING,
    allowNull: true,
  },
  customerNote: {
    type: sequelize.TEXT,
    allowNull: true,
  },

  cancelled: {
    type: sequelize.BOOLEAN,
    allowNull: false
  },

  // FK
  // checkouts in the online reservation proccess are tracked via a checkoutAttempt
  checkoutAttemptId: {
    type: sequelize.UUID,
    allowNull: true,
  },
  tableId: {
    type: sequelize.INTEGER,
    allowNull: false,
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
  tableName: "reservation",

});

reservation.associate = function (models) {
  reservation.hasOne(checkoutAttempt, {
    foreignKey: 'checkoutAttemptId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
}

module.exports = reservation