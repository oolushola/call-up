const express = require("express");
const BookingCategoryController = require("../../../controllers/admin/preferences/BookingCategory");
const {
  isLoggedIn,
  isAdmin,
  isSuperAdmin,
} = require("../../../middleware/handlers");
const validator = require("../../../middleware/validators/BookingCategory");

const BookingCategory = express.Router();

BookingCategory.get(
  "/booking-categories", 
  isLoggedIn, 
  BookingCategoryController.allBookingCategories
);

BookingCategory.get(
  '/booking-category/:bookingCategoryId',
  isLoggedIn,
  BookingCategoryController.bookingCategory
)

BookingCategory.post(
  '/booking-category',
  isLoggedIn,
  isAdmin,
  validator.CHECK_ADD_BOOKING_CATEGORY,
  BookingCategoryController.addBookingCategory
)

BookingCategory.patch(
  '/booking-category/:bookingCategoryId',
  isLoggedIn,
  isAdmin,
  validator.CHECK_UPDATE_BOOKING_CATEGORY,
  BookingCategoryController.updateBookingCategory
)

BookingCategory.delete(
  '/booking-category/:bookingCategoryId',
  isLoggedIn,
  isSuperAdmin,
  BookingCategoryController.removeBookingCategory
)

module.exports = BookingCategory
