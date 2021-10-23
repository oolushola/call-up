const express = require('express')
const validator = require('../../../middleware/validators/truck-charge')
const TruckChargeController = require('../../../controllers/admin/finance/TruckCharge')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')

const TruckCharge = express.Router()

TruckCharge.get('/truck-charge', 
  isLoggedIn,
  TruckChargeController.TruckCharge
)

TruckCharge.post('/truck-charge',
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_CHARGE,
  TruckChargeController.addTruckCharge
)

TruckCharge.delete('/truck-charge/:truckChargeId', 
  isLoggedIn,
  isSuperAdmin,
  TruckChargeController.removeTruckCharge
)


module.exports = TruckCharge