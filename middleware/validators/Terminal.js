const TerminalModel = require('../../models/terminals/Terminal')
const { body } = require('express-validator')

exports.ADD_TERMINAL = [
  body('name')
    .isString()
    .toLowerCase()
    .trim()
    .notEmpty()
    .custom(async (value, { _ }) => {
      const park = await TerminalModel.findOne({ name: value })
      if(park) {
        return Promise.reject({
          message: 'conflict',
          status: 409
        })
      }
    }),
  body('contact.phoneNos')
    .isArray()
    .notEmpty()
    .isLength({ min: 1 }),
  body('contact.address')
    .isString()
    .notEmpty()
    .trim(),
  body('parks')
    .isLength({ min: 1 })
    .isArray()
    .notEmpty()
]

exports.CHECK_PARK = [
  body('parks')
  .notEmpty()
  .isArray()
  .isLength({ min: 1 })
]