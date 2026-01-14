const Logger = require('../logger/logger')
require('dotenv').config()

module.exports = {
  development: {
    databases: {
      WebtechDatabase: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: (msg) => Logger.db(msg)
      }
    }
  },
  production: {
    databases: {
      WebtechDatabase: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: (msg) => Logger.db(msg)
      }
    }
  },
}
