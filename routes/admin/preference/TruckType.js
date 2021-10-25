const express = require('express')
const validator = require('../../../middleware/validators/TruckType')
const truckTypeController = require('../../../controllers/admin/preferences/TruckType')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')


const TruckUnion = express.Router()

TruckUnion.get('/truck-types', 
  isLoggedIn,
  truckTypeController.allTruckTypes
)

TruckUnion.get('/truck-type/:truckTypeId',
  isLoggedIn,
  truckTypeController.getTruckType
)

TruckUnion.post('/truck-type',
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_TYPE,
  truckTypeController.addTruckType
)

TruckUnion.put('/truck-type/:truckTypeId', 
  isLoggedIn,
  isAdmin,
  validator.CHECK_TRUCK_TYPE,
  truckTypeController.updateTruckType
)

TruckUnion.delete('/truck-type/:truckTypeId', 
  isLoggedIn,
  isSuperAdmin,
  truckTypeController.removeTruckType
)


module.exports = TruckUnion