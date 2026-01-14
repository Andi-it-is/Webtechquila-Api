/**
 * Minimal Backend for Webtechnology
 */


// Express related Imports
const express = require('express')
const appRouter = express()
const port = 4000

const baseURL = '/api/webtechapp/v1'

// Sequelize/Database related Imports
// const { sequelize } = require('../config/config')
// sequelize.authenticate()
//   .then(() => console.log("database connected"))
//   .catch(err => console.log("Error" + err))

// sequelize.sync()
const models = require('../models')
const reservationModel = models.reservation
const checkoutAttemptModel = models.checkout_attempt
const tableModel = models.table

// setting CORS options
const cors = require('cors')
let corsOptions = {
  origin: 'http://localhost:9000',
  optionSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST', 'DELETE']
}
appRouter.use(cors(corsOptions))
appRouter.use(express.json())

// Joi for validating request's input
const Joi = require('joi')
const CheckoutAttempt = require('../models/WebtechDatabase/CheckoutAttempt')


/**
 * route to test api
 */
appRouter.get(`${baseURL}/hello`, async (req, res) => {

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully. Welcome to the Database');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  res.send('Hello World!')
})


/**
 * TODO create a reservation with the user's input
 * TODO create a checkoutAttempt and associate the Attempt to the previous reservation. 
 * TODO return the uuid from the checkoutAttempt or the entire URL, so the user can go to: url/reservation/checkout?aid=myUUID123?!?
*/
appRouter.post(`${baseURL}/reserve`, async (req, res) => {

  const schema = Joi.object({
    guests: Joi.number().required(),
    date: Joi.string().length(10).required(),
  }).required()

  try {
    const body = await schema.validateAsync(req.body)

    const aaa = await reservationModel.findAll({
      // include: [
      //   {
      //     model: checkoutAttemptModel,
      //     as: 'checkout_attempt'
      //   },
      //   {
      //     model: tableModel,
      //     as: 'table'
      //   }
      // ]
    })

    console.log("valider body ", body)

    res.status(200).json({
      message: aaa
    })

  } catch (err) {
    res.status(500).json({
      message: err
    })
  }

})


/**
 * TODO route to confirm a checkout Attempt.(Sends additional Confirmation email)
 */
appRouter.get(`${baseURL}`, (req, res) => {
  res.send('111 2')
})


/**
 * TODO route to get every reservation ever created (both not-confirmed orders and confirmed orders)
 */
appRouter.get(`${baseURL}`, (req, res) => {
  res.send('222')
})


/**
 * TODO route to get every confirmed reservation created
 */
appRouter.get(`${baseURL}`, (req, res) => {
  res.send('333')
})



/** 
 * ! really important route (towards the end). Dont fuck this up !
 * * How to properly calculate avaible timeslots/tables etc.
 * TODO route to get every available table for the given Date.
 * * A Timeslot has a duration of 2 hours. A Timeslot (and therefore a table) is available
 * * 
 * 
 */
appRouter.get(`${baseURL}`, (req, res) => {
  res.send('444')
})





// reservation
//
// dishes




/**
 * TODO Big Filter Route to get all the dishes. 
 * * Filtering based on Enums, Search Inputs, Dish Type Enum( Vor/Haupt/Nachspeise oder Fleisch/veggie/vegan )
 */
appRouter.get(`${baseURL}`, (req, res) => {
  res.send('dish/drink und so')
})



appRouter.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})







/**
 *  * * for the current order does not exceed the total amount of capable guests within the entire timespan of the restaurant order.
 * * i.e.
 * * timeslots are [ 18:00, 18:15, 18:30, 18:45, 19:00, 19:15, 19:30, 19:45, 20:00, 20:15, 20:30, 20:45, 21:00 ]. Max amount of guests is 150.
 * * The restaurant is fully booked out from 18 - 20. a group of 8 people has submitted a reservation at 18:00, their order finishes at 20:00.
 */