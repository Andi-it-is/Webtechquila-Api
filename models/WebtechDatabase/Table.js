const sequelize = require('sequelize')
const db = require('../index')

const table = db.define("table", {

  // primary key
  tableId: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // amount of guests that a table can have at maximum. 
  // Bigger tables can be given to smaller groups of peoples 
  capacity: {
    type: sequelize.INTEGER,
  },
  premium: {
    type: sequelize.BOOLEAN,
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
  tableName: "table",

});

module.exports = table