/**
 * Minimal Backend for Webtechnology
 */
require('dotenv').config();


// Express related Imports
const express = require('express')
const appRouter = express()
const port = 4000

const baseURL = '/api/webtechapp/v1'

// Sequelize/Database related Imports
const { sequelize } = require('../config/config')
sequelize.authenticate()
  .then(() => console.log("database connected"))
  .catch(err => console.log("Error" + err))

// sequelize.sync()
const { Op, where } = require("sequelize");
const models = require('../models')
const reservationModel = models.reservation
const checkoutAttemptModel = models.checkout_attempt
const tableModel = models.table

// setting CORS options
const cors = require('cors')
let corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST', 'DELETE']
}
appRouter.use(cors(corsOptions))
appRouter.use(express.json())

// Joi for validating request's input
const Joi = require('joi')
const CheckoutAttempt = require('../models/WebtechDatabase/CheckoutAttempt')
// Logger module
const Logger = require('../logger/logger');

// custom functions and modules
const { toIsoDate, buildTimeslots, removeBlockedRange } = require('./helpers');
const { sendAuthReservationURL, sendConfirmedReservation } = require('./nodemailer')

/**
 * route to test api
 */
appRouter.get(`${baseURL}/hello`, async (req, res) => {

  try {
    await sequelize.authenticate();
    Logger.info('Connection has been established successfully. Welcome to the Database');
    Logger.info('Hello Route executed - DB is working')
  } catch (error) {
    Logger.error('Unable to connect to the database:', error);
  }

  res.send('Hello World!')
})


/**
 * * Function to send all available Timeslots from a given date, grouped per table
 */
appRouter.post(`${baseURL}/timeslots`, async (req, res) => {

  const schema = Joi.object({
    guests: Joi.number().required().max(8),
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

    // ! Optimization problem: Find table with 1) best amount of fitting guests and 2) most available timeslots
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
 * * Limitation: on api-level, multiple reservations can be set for the same/overlapping date + time ranges
 * * Function to do the following:
 *  create a reservation with the user's input
 *  create a checkoutAttempt and associate the Attempt to the previous reservation. 
 *  return the uuid from the checkoutAttempt or the entire URL, so the user can go to: url/reservation/checkout?aid=myUUID123?!?
*/
appRouter.post(`${baseURL}/init/reservation`, async (req, res) => {

  const schema = Joi.object({
    guests: Joi.number().required(),
    date: Joi.string().length(10).required(),
    time: Joi.string().length(5).required(),

    tableId: Joi.number().optional().allow(null),
    bestFit: Joi.object({
      tableId: Joi.number(),
      capacity: Joi.number(),
      selectedTimeSlot: Joi.string().length(5)
    }).allow(null)
  }).required()

  try {

    const body = await schema.validateAsync(req.body)

    body.date = toIsoDate(body.date)

    // * no tableId is passed, the user set no preference => use bestFit
    if (!body.tableId) {

      Logger.debug("create Checkout Attempt, no tableId is passed")
      // 1 create reservation
      const reservation = await reservationModel.create({
        guests: body.guests,
        date: body.date,
        time: body.time,
        prefferedSeat: false,
        cancelled: false,
        tableId: body.bestFit.tableId
      })

      const expireDate = new Date(Date.now() + 15 * 60 * 1000);

      // 2 create checkout attempt
      const checkoutAttempt = await checkoutAttemptModel.create({
        isEmailConfirmed: false,
        expiresAt: expireDate,
      })

      // 3 and associate the previous reservation with this checkout
      await reservation.update({
        checkoutAttemptId: checkoutAttempt.checkoutAttemptId
      });

      const attemptId = reservation.checkoutAttemptId

      res.status(200).json({
        aid: attemptId,
      })

      Logger.info("successfully created Checkout Attempt (with no tableId)")

    } else {

      Logger.debug(`create Checkout Attempt, using tableId ${body.tableId}`)

      // 1 create reservation
      const reservation = await reservationModel.create({
        guests: body.guests,
        date: body.date,
        time: body.time,
        prefferedSeat: true,
        cancelled: false,
        tableId: body.tableId
      })

      const expireDate = new Date(Date.now() + 15 * 60 * 1000);

      // 2 create checkout attempt
      const checkoutAttempt = await checkoutAttemptModel.create({
        isEmailConfirmed: false,
        expiresAt: expireDate,
      })

      // 3 and associate the previous reservation with this checkout
      await reservation.update({
        checkoutAttemptId: checkoutAttempt.checkoutAttemptId
      });

      const attemptId = reservation.checkoutAttemptId

      res.status(200).json({
        aid: attemptId,
      })
    }

  } catch (err) {

    Logger.error(`error: ${err}`)
    res.status(500).json({
      message: err
    })
  }


})

/**
 * * route to get reservation data based on the checkoutAttemptId/aid.
 * * used within the checkout Page, since Vue Store is dogshit
 */
appRouter.get(`${baseURL}/reservation`, async (req, res) => {

  const schema = Joi.object({
    aid: Joi.string().uuid()
  })

  try {

    const param = await schema.validateAsync(req.query)

    // Logger.debug("oben reservation.   und unten checkoutAttempt")
    // Logger.debug(reservationModel.associations)
    // Logger.debug(checkoutAttemptModel.associations)

    //* checkoutAttempt joined with reservation
    const reservation = await checkoutAttemptModel.findOne({
      include: {
        model: reservationModel,
        required: true,
        where: {
          checkoutAttemptId: param.aid
        }
      },
    })

    res.status(200).json({
      data: reservation,
    })

  } catch (err) {
    Logger.error(`fehler ${err}`)
    res.status(500).json({
      message: err,
    })
  }
})

/**
 * * Step 1 from the checkout process.
 * @return Url to follow to, where the user validates the order
 */
appRouter.post(`${baseURL}/init/checkoutAttempt`, async (req, res) => {

  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    tel: Joi.string().required(),
    customerNote: Joi.string().allow(null).allow(''),

    checkoutAttemptId: Joi.string().required(),
  }).required()

  try {

    const body = await schema.validateAsync(req.body)

    const reservationEntry = await reservationModel.findOne({
      where: {
        checkoutAttemptId: body.checkoutAttemptId
      },
    })

    const reservation = await reservationEntry.update({

      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      tel: body.tel,
      customerNote: body.customerNote,
    })

    const url = `http://localhost:9000/#/order/confirm?rid=${reservation.reservationId}&aid=${reservationEntry.checkoutAttemptId}`

    // Logger.info("Sending Auth Reservation URL Mail")
    // this is the first email that would be sent
    // const mail = await sendAuthReservationURL(url)

    res.status(200).json({
      success: true,
      message: reservation,
    })

  }
  catch (err) {
    Logger.error(`fehler ${err}`)
    res.status(500).json({
      message: err,
    })
  }
})


/**
 * * Step 2 from the checkout process.
 * confirms the order and changes it in the db
 */
appRouter.get(`${baseURL}/confirm/checkoutAttempt`, async (req, res) => {

  const schema = Joi.object({
    rid: Joi.string().required(),
    aid: Joi.string().uuid().required()
  }).required()

  try {

    const params = await schema.validateAsync(req.query)

    const reservation = await checkoutAttemptModel.findOne({
      include: {
        model: reservationModel,
        required: true,
        where: {
          checkoutAttemptId: params.aid
        }
      },
    })

    if (reservation.isEmailConfirmed) {
      res.status(500).json({
        message: "war schon validated"
      })
    }

    const upd = await reservation.update({
      isEmailConfirmed: true
    })

    const keyInformations = {
      date: reservation.reservation.date,
      time: reservation.reservation.time,
      guests: reservation.reservation.guests,
      tableId: reservation.reservation.tableId,
      firstName: reservation.reservation.firstName,
      lastName: reservation.reservation.lastName,
      customerNote: reservation.reservation.customerNote
    }

    // this is the second email that would be sent
    // Logger.info("Sending Confirmed Reservation Mail")
    // const mail = await sendConfirmedReservation(keyInformations)


    res.status(200).json({
      success: true,
      data: reservation,
      key: keyInformations
    })

  }
  catch (err) {
    Logger.error(`fehler ${err}`)
    res.status(500).json({
      message: err,
    })
  }
})


// Start Server
appRouter.listen(port, () => {
  Logger.info(`🚀 Server is running on http://localhost:${port}${baseURL}`)
})

/**
 *  * * for the current order does not exceed the total amount of capable guests within the entire timespan of the restaurant order.
 * * i.e.
 * * timeslots are [ 18:00, 18:15, 18:30, 18:45, 19:00, 19:15, 19:30, 19:45, 20:00, 20:15, 20:30, 20:45, 21:00 ]. Max amount of guests is 150.
 * * The restaurant is fully booked out from 18 - 20. a group of 8 people has submitted a reservation at 18:00, their order finishes at 20:00.
 */
