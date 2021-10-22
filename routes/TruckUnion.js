const express = require('express')
const { VALIDATE_TRUCK_UNION } = require('../middleware/validators/TruckUnion')
const TruckUnionController = require('../controllers/TruckUnion')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../middleware/handlers')


const TruckUnion = express.Router()

TruckUnion.get('/truck-unions', 
  isLoggedIn,
  TruckUnionController.allTruckUnions
)

TruckUnion.get('/truck-union/:truckUnionId',
  isLoggedIn,
  TruckUnionController.getTruckUnion
)

TruckUnion.post('/truck-union',
  isLoggedIn,
  isAdmin,
  VALIDATE_TRUCK_UNION,
  TruckUnionController.AddTruckUnion
)

TruckUnion.put('/truck-union/:truckUnionId', 
  isLoggedIn,
  isAdmin,
  VALIDATE_TRUCK_UNION,
  TruckUnionController.updateTruckUnion
)

TruckUnion.delete('/truck-union/:truckUnionId', 
  isLoggedIn,
  isSuperAdmin,
  TruckUnionController.removeTruckUnion
)


module.exports = TruckUnion