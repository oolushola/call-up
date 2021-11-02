const express = require('express')
const { body } = require('express-validator')
const TruckController = require('../controllers/transporter/Truck')

const Truck = express.Router()

Truck.post(
  '/add-truck',
  TruckController.addTruck
)

module.exports = Truck