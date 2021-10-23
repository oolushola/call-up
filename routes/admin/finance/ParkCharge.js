const express = require('express')
const validator = require('../../../middleware/validators/park-charge')
const ParkChargeController = require('../../../controllers/admin/finance/ParkCharge')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')

const ParkCharge = express.Router()

ParkCharge.get('/park-charge', 
  isLoggedIn,
  ParkChargeController.parkCharge
)

ParkCharge.post('/park-charge',
  isLoggedIn,
  isAdmin,
  validator.CHECK_PARK_CHARGE,
  ParkChargeController.addParkCharge
)

ParkCharge.delete('/park-charge/:parkChargeId', 
  isLoggedIn,
  isSuperAdmin,
  ParkChargeController.removeParkCharge
)


module.exports = ParkCharge