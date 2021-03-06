const express = require('express')
const BookingController = require('../controllers/Booking')
const { isLoggedIn } = require('../middleware/handlers')

const BookingRoute = express.Router()

BookingRoute.get(
  '/booking-activities',
  isLoggedIn,
  BookingController.getBookingActivities
)

BookingRoute.get(
  '/preview-call-up',
  isLoggedIn,
  BookingController.getCallUpPreviews
)

BookingRoute.get(
  '/preview-journey-code',
  isLoggedIn,
  BookingController.journeyCodeBooking
)

BookingRoute.post(
  '/book-call-up',
  isLoggedIn,
  BookingController.createBooking
)

BookingRoute.delete(
  '/holding-bay/add-on/:bookingId',
  isLoggedIn,
  BookingController.removeHoldingBayAddOn
)

BookingRoute.delete(
  '/holding-bay/stops/:bookingId',
  isLoggedIn,
  BookingController.removeHoldingBayStop
)

BookingRoute.patch(
  '/wallet-transaction-update',
  isLoggedIn,
  BookingController.holdingBayPayment
)

BookingRoute.get(
  '/trucks-in-park',
  isLoggedIn,
  BookingController.trucksInPark
)

BookingRoute.get(
  '/park-booking-activities',
  isLoggedIn,
  BookingController.parkBookingActivities
)

module.exports = BookingRoute