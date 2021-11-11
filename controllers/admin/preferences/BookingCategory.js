const BookingCategoryModel = require("../../../models/admin/preferences/BookingCategory");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class BookingCategoryController {
  static async allBookingCategories(req, res, next) {
    try {
      const features = await BookingCategoryModel.find()
        .sort({ feature: "asc" })
        .populate("updates.lastUpdatedBy", "name");
      response(res, 200, features, "booking categories");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async bookingCategory(req, res, next) {
    try {
      const { bookingCategoryId } = req.params;
      const bookingCategory = await BookingCategoryModel.findById(
        bookingCategoryId
      ).populate("updates.lastUpdaredBy", "name");
      if (!bookingCategory) {
        return response(res, 404, null, "resource not found");
      }
      response(res, 200, bookingCategory, "booking category");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addBookingCategory(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { name } = req.body;
      const addBookingCategory = new BookingCategoryModel({
        name: name,
        updates: [
          {
            lastUpdatedBy: req.userId,
          },
        ],
      });
      const addBookingCategoryResponse = await addBookingCategory.save();
      response(res, 201, addBookingCategoryResponse, "booking category added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateBookingCategory(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { bookingCategoryId } = req.params;
      const { name } = req.body;
      const updateBookingCategory = await BookingCategoryModel.findById(
        bookingCategoryId
      );
      updateBookingCategory.name = name;
      updateBookingCategory.updates.push({
        lastUpdatedBy: req.userId,
      });
      const saveBookingCategoryInstance = await updateBookingCategory.save();
      response(res, 200, saveBookingCategoryInstance, "updated");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeBookingCategory(req, res, next) {}
}

module.exports = BookingCategoryController;
