const express = require('express')
const validator = require('../../../middleware/validators/TruckType')
const truckTypeController = require('../../../controllers/admin/preferences/TruckType')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')


const TruckType = express.Router()

TruckType.get('/truck-types', 
  isLoggedIn,
  truckTypeController.allTruckTypes
)

TruckType.get('/truck-type/:truckTypeId',
  isLoggedIn,
  truckTypeController.getTruckType
)

TruckType.post('/truck-type',
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_TYPE,
  truckTypeController.addTruckType
)

TruckType.put('/truck-type/:truckTypeId', 
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_TYPE,
  truckTypeController.updateTruckType
)

TruckType.delete('/truck-type/:truckTypeId', 
  isLoggedIn,
  isSuperAdmin,
  truckTypeController.removeTruckType
)


module.exports = TruckType