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
const { Op } = require("sequelize");
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
const { toIsoDate, buildTimeslots, removeTimeRange, removeBlockedRange } = require('./helpers')


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
 * * Function to send all available Timeslots from a given date, grouped per table
 */
appRouter.post(`${baseURL}/timeslots`, async (req, res) => {

  const schema = Joi.object({
    guests: Joi.number().required(),
    date: Joi.string().length(10).required(),
  }).required()

  try {
    const body = await schema.validateAsync(req.body)

    // cast german date to iso 8601
    const isoDate = toIsoDate(body.date)

    const allReservations = await reservationModel.findAll({
      where: {
        date: isoDate
      }
    })

    let freeSlots = []
    const allTables = await tableModel.findAll({
      // where: {
      //   capacity: {
      //     [Op.gte]: body.guests
      //   }
      // }
    })

    allTables.forEach((element) => {

      let obj = {
        tableId: element.tableId,
        capacity: element.capacity,
        timeSlots: [
          '15:00', '15:15', '15:30', '15:45',
          '16:00', '16:15', '16:30', '16:45',
          '17:00', '17:15', '17:30', '17:45',
          '18:00', '18:15', '18:30', '18:45',
          '19:00', '19:15', '19:30', '19:45',
          '20:00', '20:15', '20:30', '20:45',
          '21:00',
          // '21:15', '21:30', '21:45',
          // '22:00', '22:15', '22:30', '22:45',
        ]
      }

      freeSlots.push(obj)
    });


    // if a reservation is done, multiple timeslots are no longer available for a table.
    // a reservation made for 17:00 removes the timeslots 15:15 - 18:45 for this table.
    allReservations.forEach((reservation) => {
      freeSlots.forEach((table) => {

        if (table.tableId === reservation.tableId) {

          const occupiedSlot = buildTimeslots(reservation.time)
          const newAvailableTimeSlots = removeBlockedRange(table.timeSlots, occupiedSlot[0], occupiedSlot[occupiedSlot.length - 1])
          table.timeSlots = newAvailableTimeSlots
        }
      })
    })

    // ! Optimierungsproblem: Tisch mit möglichst passender capacity/guest Zahl und den meisten verfügbaren Timeslots.

    // determine every table that fits the wished amount of guests
    const sizeFittingTables = freeSlots.filter((table) => {
      return table.capacity - body.guests >= 0
    })

    // determine the smallest possible difference between capacity and guests => least amount of "empty" seats per reservation
    const minCapacityDiff = Math.min(
      ...sizeFittingTables.map(table => table.capacity - body.guests)
    );

    // all tables with the smallest capacity <--> guest difference
    const bestCapacityTables = sizeFittingTables.filter(
      table => table.capacity - body.guests === minCapacityDiff
    );

    // "free-est" amount of capacities
    const maxSlots = Math.max(...bestCapacityTables.map(t => t.timeSlots.length));

    // every table with the most amount of free timeslots and fitting capacities. These are all the best options.
    const mostSlotsTables = bestCapacityTables.filter(t => t.timeSlots.length === maxSlots);

    // a single option to be chosen, if customer does not decide where to sit
    const bestSingleTable = mostSlotsTables[0] || {}

    res.status(200).json({
      tables: freeSlots,
      sizeOptimizedTables: bestCapacityTables,
      sizeAndSlotOptimizedTables: mostSlotsTables,
      bestFit: bestSingleTable
    })

  } catch (error) {

    res.status(500).json({
      message: error
    })
  }

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
    startTime: Joi.string().length(5).required(),
    prefferedSeat: Joi.boolean().required(),
    tableId: Joi.number().allow(null).required(),


  }).required()

  try {
    const body = await schema.validateAsync(req.body)

    if (!body.prefferedSeat) {
      console.log("---")  // auto-determine the next available tableId, to not hurt null-constraint
    }

    const reservation = await reservationModel.create({
      guests: body.guests,
      date: body.date,
      startTime: body.startTime,
      prefferedSeat: false,
      cancelled: false,
      tableId: 1,

    })

    res.status(200).json({
      message: reservation
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