const express = require("express");
const ParkFeaturesController = require("../../../controllers/admin/preferences/ParkFeatures");
const {
  isLoggedIn,
  isAdmin,
  isSuperAdmin,
} = require("../../../middleware/handlers");
const validator = require("../../../middleware/validators/ParkFeatures.js");

const ParkFeatures = express.Router();

ParkFeatures.get(
  "/park-features", 
  isLoggedIn, 
  ParkFeaturesController.getAllParkFeatures
);

ParkFeatures.get(
  '/park-features/:parkFeaturedId',
  isLoggedIn,
  ParkFeaturesController.parkFeature
)

ParkFeatures.post(
  '/park-feature',
  isLoggedIn,
  isAdmin,
  validator.CHECK_ADD_FEATURE,
  ParkFeaturesController.addParkFeature
)

ParkFeatures.patch(
  '/park-feature/:parkFeatureId',
  isLoggedIn,
  isAdmin,
  validator.CHECK_ADD_FEATURE,
  ParkFeaturesController.updateParkFeature
)

ParkFeatures.delete(
  '/park-feature/:parkFeatureId',
  isLoggedIn,
  isSuperAdmin,
  ParkFeaturesController.removeParkFeature
)

module.exports = ParkFeatures
