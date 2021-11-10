const { body } = require('express-validator')
const TruckModel = require('../../models/transporter/truck')

exports.ADD_NEW_TRUCK = [
  body('truckName')
    .isString()
    .notEmpty()
    .trim()
    .toLowerCase(),
  body('truckType')
    .isMongoId()
    .notEmpty(),
  body('truckModel')
    .isString()
    .notEmpty()
    .trim()
    .toLowerCase(),
  body('plateNo')
    .notEmpty()
    .toLowerCase()
    .trim()
    .custom(async (value, {req}) => {
      const transporterTrucks = await TruckModel.findOne({ ownedBy: req.userId })
      if(transporterTrucks) {
        if(transporterTrucks.length > 0) {
          return transporterTrucks.trucks.map(truck => {
            if(truck.plateNo === value) {
              throw new Error('truck already exists')
            }
            return true
          })
        }
        else{
          return true
        }
      }
      else{
        return true
      }
    }),
  body('chasisNo')
    .notEmpty()
    .toLowerCase()
    .trim()
    .custom(async (value, {req}) => {
      const transporterTrucks = await TruckModel.findOne({ ownedBy: req.userId })
      if(transporterTrucks) {
        if(transporterTrucks.length > 0) {
          return transporterTrucks.trucks.map(truck => {
            if(truck.plateNo === value) {
              throw new Error('truck already exists')
            }
            return true
          })
        }
        else{
          return true
        }
      }
      else{
        return true
      }
    }),
  body('union')
    .notEmpty()
    .isMongoId(),
  body('length')
    .notEmpty()
    .isMongoId(),
  body('color')
    .isString()
    .notEmpty()
    .trim()
    .toLowerCase(),
    

]