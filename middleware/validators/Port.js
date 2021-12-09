const { body } = require('express-validator')
const PortModel = require("../../models/admin/preferences/Port")

exports.ADD_PORT = [
  body('name')
    .isString()
    .notEmpty()
    .trim()
    .toLowerCase()
    .custom(async (value, { _ }) => {
      const checkPortName = await PortModel.findOne({ name: value })
      if (checkPortName) {
        return Promise.reject("conflict")
      }
      return true
    }),
  body("address")
    .optional()
    .isString()
    .trim()
    .toLowerCase()
]

exports.UPDATE_PORT = [
  body('name')
    .isString()
    .notEmpty()
    .trim()
    .toLowerCase()
    .custom(async (value, { req }) => {
      const checkPort = await PortModel.findOne({
        name: value, _id: {
          $ne: req.params.portId
        }
      })
      if (checkPort) {
        return Promise.reject("conflict")
      }
      return true
    }),
  body("address")
    .optional()
    .isString()
    .trim()
    .toLowerCase()
]