const { body } = require("express-validator");
const AddOnServiceModel = require("../../models/admin/finance/AddOnService");

exports.CHECK_SAVE_ADD_ON = [
  body("addOn")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { _ }) => {
      const addOnService = await AddOnServiceModel.findOne({ addOn: value });
      if (addOnService) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
  body('amount')
    .isFloat()
    .notEmpty()
];

exports.CHECK_UPDATE_ADD_ON = [
  body("addOn")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { req }) => {
      const addOnService = await AddOnServiceModel.findOne({
        addOn: value,
        $where: { _id: { $ne: req.params.addOnServiceId } },
      });
      if (addOnService) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
  body('amount')
    .isFloat()
    .notEmpty()
];
  