const express = require('express')
const { ParkController, upload } = require("../controllers/parks/Park");
const validator = require("../middleware/validators/Park");
const { isLoggedIn, isAdmin, isSuperAdmin, walletPrivilege } = require("../middleware/handlers");

const ParkRoute = express.Router()

ParkRoute.get(
  '/park/holding-bays',
  isLoggedIn,
  ParkController.getHoldingBayParks
)

ParkRoute.get(
  '/parks/all',
  isLoggedIn,
  ParkController.allParks
)

ParkRoute.post(
  '/new/park',
  isLoggedIn,
  walletPrivilege,
  upload,
  validator.CHECK_ADD_PARK,
  ParkController.addParks
)

ParkRoute.get(
  '/user/park',
  isLoggedIn,
  ParkController.userPark
)

module.exports = ParkRoute
