'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const Logger = require('../logger/logger')
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(__dirname + '/../config/dbConfig.js')[env];
const dbs = {};
const models = {};

/**
 * creates the connections and initial settings for the Databases in String. and tests the connection.
 * @name setupDb
 * @async
 * @function
 * @param  {String} dbName Database Name
 */
let setupDb = async (dbName) => {
  let dbObj = dbConfig.databases[dbName]
  dbs[dbName] = new Sequelize({
    database: dbObj.database,
    host: dbObj.host,
    username: dbObj.username,
    password: dbObj.password,
    port: dbObj.port,
    dialect: dbObj.dialect,
    logging: (msg) => Logger.db(msg),
    define: {
      freezeTableName: true
    }
  })
}
/**
 *
 * @name modelImport
 * @async
 * @function
 * @param  {Object} dbInstance Database Address
 * @param  {String} dbName Database Name
 */
let modelImport = async (dbInstance, dbName) => {
  fs.readdirSync(path.join(__dirname, dbName))
    .filter(
      (file) =>
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach((file) => {
      const model = require(path.join(__dirname, dbName, file))(
        dbInstance,
        Sequelize
      )
      models[model.name] = model
    })
}

/**
 * 1 - initilize dbs
 */
const dbNames = Object.keys(dbConfig.databases)
dbNames.forEach(async (dbName) => {
  try {
    await setupDb(dbName)
    await dbs[dbName].authenticate()
    Logger.info(`Connection to ${dbName} has been established successfully.`)
  } catch (error) {
    Logger.error(`Unable to connect to ${dbName} : ${error}`)

  }
})

/*
 *  2 - Import Models
 */
Object.keys(dbs).forEach(async (key) => {
  try {
    var dbInstance = dbs[key]
    var dbName = dbs[key].config.database
    await modelImport(dbInstance, dbName)
    Logger.info(`Loaded Models for ${dbName} DB`)
  } catch (error) {
    console.log(error)
    Logger.error(`Unable to load Models for the following DB ${dbName}  : ${error}`)
  }
})

/**
 * 3 - Associate Models
 */
Object.keys(models).forEach(async (modelName) => {
  try {
    if (models[modelName].associate) {
      await models[modelName].associate(models)
    }
  } catch (error) {
    console.error(error)
    Logger.error(
      `Unable to make Associations for ${modelName} model : ${error}`
    )
  }
})

/**
 * 4 - Syn Models to DBs
 */
/* Object.keys(dbs).forEach(async (dbName) => {
  try {
    // await dbs[dbName].sync({ force: true })  // Always dropping the table if it exists, then (re)creates it *NEVER have this in Production! Any Data will be lost
    // await dbs[dbName].sync({ alter: true })  // Alters the table if Model definition differs from actual Table in DB
    await dbs[dbName].sync()                    // Creates Table if it doesn't already exists - does nothing if it does *Only this should be in Production!
  } catch (error) {
    Logger.error(`Unable to sync ${dbName} DB : ${error}`)
  }
}) */

module.exports = models

