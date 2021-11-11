const { body } = require("express-validator");
const BookingCategoryModel = require("../../models/admin/preferences/BookingCategory")

exports.CHECK_ADD_BOOKING_CATEGORY = [
  body("name")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { _ }) => {
      const getBookingCategory = await BookingCategoryModel.findOne({ name: value });
      if (getBookingCategory) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
];

exports.CHECK_UPDATE_BOOKING_CATEGORY = [
  body("name")
    .isString()
    .notEmpty()
    .trim()
    .custom(async (value, { req }) => {
      const getParkModel = await BookingCategoryModel.findOne({
        name: value,
        $where: { _id: { $ne: req.params.bookingCategoryId } },
      });
      if (getParkModel) {
        return Promise.reject({
          data: "conflict",
          status: 409,
        });
      }
    }),
];
  