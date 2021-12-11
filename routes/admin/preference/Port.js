const express = require('express')
const PortController = require("../../../controllers/admin/preferences/Port")
const { isLoggedIn, isAdmin } = require("../../../middleware/handlers")
const validate = require("../../../middleware/validators/Port")


const PortRoute = express.Router()

PortRoute.get(
  '/ports',
  isLoggedIn,
  PortController.allPorts
)

PortRoute.get(
  '/port/:portId',
  isLoggedIn,
  PortController.port
)

PortRoute.post(
  '/port/new',
  isLoggedIn,
  isAdmin,
  validate.ADD_PORT,
  PortController.addPort
)

PortRoute.patch(
  '/port/:portId',
  isLoggedIn,
  isAdmin,
  PortController.togglePortStatus
)

PortRoute.put(
  '/port/:portId',
  isLoggedIn,
  isAdmin,
  validate.UPDATE_PORT,
  PortController.updatePort
)

module.exports = PortRoute