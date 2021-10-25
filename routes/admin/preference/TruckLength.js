const express = require('express')
const validator = require('../../../middleware/validators/TruckLength')
const truckLengthController = require('../../../controllers/admin/preferences/TruckLength')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')


const TruckLength = express.Router()

TruckLength.get('/truck-lengths', 
  isLoggedIn,
  truckLengthController.allTruckLength
)

TruckLength.get('/truck-length/:truckLengthId',
  isLoggedIn,
  truckLengthController.getTruckLength
)

TruckLength.post('/truck-length',
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_LENGTH,
  truckLengthController.addTruckLength
)

TruckLength.put('/truck-length/:truckLengthId', 
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_LENGTH,
  truckLengthController.updateTruckLength
)

TruckLength.delete('/truck-length/:truckLengthId', 
  isLoggedIn,
  isSuperAdmin,
  truckLengthController.removeTruckLength
)


module.exports = TruckLength