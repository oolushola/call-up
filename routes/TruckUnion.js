const express = require('express')
const { VALIDATE_TRUCK_UNION } = require('../middleware/validators/TruckUnion')
const TruckUnionController = require('../controllers/TruckUnion')
const { VERIFY_TOKEN, SUPER_ADMIN, IS_ADMIN } = require('../middleware/handlers')


const TruckUnion = express.Router()

// TruckUnion.get('/truck-unions', 
//   VERIFY_TOKEN(req, res, _, req.headers.Authorization),
//   TruckUnionController.allTruckUnions
// )

// TruckUnion.get('/truck-union/{truckUnionId}',
//   VERIFY_TOKEN(req, res, _, req.headers.Authorization),
//   TruckUnionController.getTruckUnion
// )

// TruckUnion.post('/truck-union',
//   VERIFY_TOKEN(req, res, _, req.headers.Authorization),
//   IS_ADMIN,
//   VALIDATE_TRUCK_UNION,
//   TruckUnionController.AddTruckUnion
// )

// TruckUnion.put('/truck-union/{truckUnionId}', 
//   VERIFY_TOKEN(req, res, _, req.headers.Authorization),
//   VALIDATE_TRUCK_UNION,
//   TruckUnionController.updateTruckUnion
// )

// TruckUnion.delete('/truck-union/{truckUnionId}', 
//   VERIFY_TOKEN(req, res, _, req.headers.Authorization),
//   SUPER_ADMIN,
//   TruckUnionController.removeTruckUnion
// )


module.exports = TruckUnion