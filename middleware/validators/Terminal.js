const TerminalModel = require('../../models/terminals/Terminal')
const { body } = require('express-validator')

exports.ADD_TERMINAL = [
  body('portId')
    .isMongoId()
    .notEmpty()
    .trim(),
  body('name')
    .isString()
    .toLowerCase()
    .trim()
    .notEmpty()
    .custom(async (value, { _ }) => {
      const park = await TerminalModel.findOne({ name: value })
      if (park) {
        return Promise.reject("conflict")
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
]

exports.UPDATE_TERMINAL = [
  body('portId')
    .isMongoId()
    .notEmpty()
    .trim(),
  body('name')
    .isString()
    .toLowerCase()
    .trim()
    .notEmpty()
    .custom(async (value, { req }) => {
      const park = await TerminalModel.findOne({
        name: value, _id: {
          $ne: req.params.terminalId
        }
      })
      if (park) {
        return Promise.reject("conflict")
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
]

exports.CHECK_PARK = [
  body('parks')
    .notEmpty()
    .isArray()
    .isLength({ min: 1 })
]