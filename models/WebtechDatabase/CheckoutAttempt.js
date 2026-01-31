const sequelize = require('sequelize')
const db = require('../index')
const reservation = require('./Reservation');

// const checkoutAttempt = db.define("checkout_attempt", {

//   // primary key
//   checkoutAttemptId: {
//     type: sequelize.UUID,
//     primaryKey: true,
//   },

//   // boolean to determine if this checkout attempt was confirmed via a 2FA e-mail confirmation process
//   isEmailConfirmed: {
//     type: sequelize.BOOLEAN,
//   },
//   expiresAt: {
//     type: sequelize.DATE,
//   },

//   // default Columns
//   createdAt: {
//     type: sequelize.DATE,
//     allowNull: false,
//   },
//   updatedAt: {
//     type: sequelize.DATE,
//     allowNull: false,
//   }

// }, {
//   tableName: "checkout_attempt",

// });


// checkoutAttempt.associate = function (models) {
//   checkoutAttempt.hasOne(reservation, {
//     foreignKey: 'reservationId',
//     onDelete: 'SET NULL',
//     onUpdate: 'CASCADE',
//   })
// }

// module.exports = checkoutAttempt


/**
 * @constructs ReservierungModel
 * @param  {Sequelize} sequelize Data Base connection instance
 * @param  {DataType} DataTypes Data Type Class from Sequelize
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  const checkoutAttemptSchema = {
    // primary key
    checkoutAttemptId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // boolean to determine if this checkout attempt was confirmed via a 2FA e-mail confirmation process
    isEmailConfirmed: {
      type: DataTypes.BOOLEAN,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },

    // default Columns
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }

  const checkoutAttempt = sequelize.define('checkout_attempt', checkoutAttemptSchema, {
    freezeTableName: true
  })

  checkoutAttempt.associate = function (models) {
    checkoutAttempt.hasOne(models.reservation, {
      foreignKey: 'checkoutAttemptId',
    })
  }

  return checkoutAttempt
}