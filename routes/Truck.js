const express = require('express')
const { body } = require('express-validator')
const { TruckController, uploader } = require('../controllers/transporter/Truck')
const { isLoggedIn } = require('../middleware/handlers')
const validator = require('../middleware/validators/Trucks')

const Truck = express.Router()

Truck.get(
  '/available-for-callup',
  isLoggedIn,
  TruckController.availableForCallUp
)

Truck.get(
  '/verified-trucks',
  isLoggedIn,
  TruckController.getVerifiedTrucks
)

Truck.get(
  '/trucks-pending-verification',
  isLoggedIn,
  TruckController.trucksPendingVerification
)

Truck.post(
  '/add-truck',
  isLoggedIn,
  uploader.single('truckImage'),
  validator.ADD_NEW_TRUCK,
  TruckController.addTruck
)

Truck.get(
  '/truck/overview',
  isLoggedIn,
  TruckController.truckOverview
)

module.exports = Truck