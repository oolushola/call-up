const { body } = require("express-validator");
const ParkFeatureModel = require("../../models/admin/preferences/ParkFeatures");

exports.CHECK_ADD_FEATURE = [
  body("feature")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { _ }) => {
      const getParkModel = await ParkFeatureModel.findOne({ feature: value });
      if (getParkModel) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
];

exports.CHECK_UPDATE_FEATURE = [
  body("feature")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { req }) => {
      const getParkModel = await ParkFeatureModel.findOne({
        feature: value,
        $where: { _id: { $ne: req.params.parkFeatureId } },
      });
      if (getParkModel) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
];
  