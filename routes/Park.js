const express = require('express')
const ParkModel = require("../models/Parks/park");
const ParkController = require("../controllers/parks/Park");
const validator = require("../middleware/validators/Park");
const { isLoggedIn, isAdmin, isSuperAdmin, walletPrivilege } = require("../middleware/handlers");

const ParkRoute = express.Router()

ParkRoute.get(
  '/parks/all',
  isLoggedIn,
  ParkController.allParks
)

ParkRoute.post(
  '/new/park',
  isLoggedIn,
  walletPrivilege,
  validator.CHECK_ADD_PARK,
  ParkController.addParks
)

ParkRoute.get(
  '/user/park',
  isLoggedIn,
  ParkController.userPark
)

module.exports = ParkRoute
