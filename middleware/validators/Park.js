const { body } = require('express-validator')
const ParkModel = require('../../models/Parks/park')

exports.CHECK_ADD_PARK = [
  body('name')
    .isString()
    .trim()
    .toLowerCase()
    .notEmpty()
    .custom(async (value, { req })=> {
      const checkExists = await ParkModel.findOne({ name: value })
      if(checkExists) {
        return Promise.reject({
          message: 'conflict',
          status: 409
        })
      }
    }),
  body('capacity')
    .isNumeric()
    .notEmpty(),
  body('type')
    .isMongoId()
    .notEmpty(),
  body('contact.phoneNos')
    .isArray()
    .isLength({ min: 1 })
    .notEmpty(),
  body('contact.address')
    .isString()
    .notEmpty()
    .trim(),
  body('parkStatus')
    .isBoolean()
    .notEmpty(),
]

exports.CHECK_PARK_UPDATE = [
  body('name')
    .isString()
    .trim()
    .toLowerCase()
    .notEmpty(),
  body('capacity')
    .isNumeric()
    .notEmpty(),
  body('type')
    .isMongoId()
    .notEmpty(),
  body('contact.phoneNos.*')
    .isArray()
    .isLength({ min: 1 }),
  body('contact.phoneNos.address')
    .isString()
    .notEmpty()
    .trim(),
  body('parkStatus')
    .isBoolean()
    .notEmpty(),
]