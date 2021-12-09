const express = require('express')
const { VALIDATE_TRUCK_UNION } = require('../../../middleware/validators/TruckUnion')
const TruckUnionController = require('../../../controllers/admin/preferences/TruckUnion')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')


const TruckUnion = express.Router()

TruckUnion.get(
  '/union-overview',
  isLoggedIn,
  TruckUnionController.unionOverview
)

TruckUnion.get('/truck-unions',
  isLoggedIn,
  TruckUnionController.allTruckUnions
)

TruckUnion.get('/truck-union/:truckUnionId',
  isLoggedIn,
  isAdmin,
  TruckUnionController.getTruckUnion
)

TruckUnion.get(
  '/user-truck-union',
  isLoggedIn,
  TruckUnionController.getAccountUnion
)

TruckUnion.post('/truck-union',
  isLoggedIn,
  VALIDATE_TRUCK_UNION,
  TruckUnionController.AddTruckUnion
)

TruckUnion.put('/truck-union/:truckUnionId',
  isLoggedIn,
  VALIDATE_TRUCK_UNION,
  TruckUnionController.updateTruckUnion
)

TruckUnion.delete('/truck-union/:truckUnionId',
  isLoggedIn,
  isSuperAdmin,
  TruckUnionController.removeTruckUnion
)


module.exports = TruckUnion