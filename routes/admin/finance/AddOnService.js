const express = require("express");
const AddOnServiceController = require("../../../controllers/admin/finance/AddOnService");
const {
  isLoggedIn,
  isAdmin,
  isSuperAdmin,
} = require("../../../middleware/handlers");
const validator = require("../../../middleware/validators/AddOnService");

const AddOnService = express.Router();

AddOnService.get(
  "/addon-services", 
  isLoggedIn, 
  AddOnServiceController.allAddOnServices
);

AddOnService.get(
  '/addon-service/:addOnServiceId',
  isLoggedIn,
  AddOnServiceController.addOnService
)

AddOnService.post(
  '/addon-service',
  isLoggedIn,
  isAdmin,
  validator.CHECK_SAVE_ADD_ON,
  AddOnServiceController.saveAddOnService
)

AddOnService.patch(
  '/booking-service/:addOnServiceId',
  isLoggedIn,
  isAdmin,
  validator.CHECK_UPDATE_ADD_ON,
  AddOnServiceController.updateAddOnService
)

AddOnService.delete(
  '/booking-service/:addOnServiceId',
  isLoggedIn,
  isSuperAdmin,
  AddOnServiceController.removeaddOnService
)

module.exports = AddOnService
