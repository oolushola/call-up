const BookingModel = require("../models/BookingModel");
const TruckModel = require("../models/transporter/truck");
const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");
const crypto = require("crypto");

class BookingController {
  static async getBookingActivities(req, res, next) {
    try {
      let bookingResponse = [];
      const userBookings = await BookingModel.find({ ownedBy: req.userId })
        .populate(
          "ownedBy terminalId bookingCategoryId parkId stops.parkId",
          "name contact plateNo bookingCategory"
        )
        .sort({ createdAt: "asc" });
      
      await Promise.all(userBookings.map(async booking => {
        const userTrucks = await TruckModel.findOne({ ownedBy: req.userId });
        const truckInfo = userTrucks.trucks.find(
          (truck) => truck._id.toString() === booking.truckId.toString()
        );
        bookingResponse.push({ userBookings, truckInfo });
      }))
      response(res, 200, bookingResponse, "booking responses");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
  static async getCallUpPreviews(req, res, next) {
    try {
      const bookings = req.query.bookings;
      const bookingData = bookings.split(",");
      let bookingResponse = [];
      await Promise.all(
        bookingData.map(async (bookingId) => {
          const bookingQuery = await BookingModel.findById(bookingId)
            .populate(
              "ownedBy terminalId bookingCategoryId parkId stops.parkId",
              "name contact plateNo bookingCategory"
            )
            .sort({ createdAt: "asc" });

          const userTrucks = await TruckModel.findOne({ ownedBy: req.userId });
          const truckInfo = userTrucks.trucks.find(
            (truck) => truck._id.toString() === bookingQuery.truckId.toString()
          );
          bookingResponse.push({ bookingQuery, truckInfo });
        })
      );
      response(res, 200, bookingResponse, "booking responses");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async createBooking(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation result");
      }
      const {
        terminalId,
        bookingCategoryId,
        location,
        trucks,
        parkStayDuration,
        parkId,
        expectedDateOfArrival,
        expectedTimeOfArrival,
        stops,
        addOnService,
      } = req.body;

      let bookingResponse = [];

      await Promise.all(
        trucks.map(async (truckId) => {
          const bookingInstance = new BookingModel({
            ownedBy: req.userId,
            terminalId: terminalId,
            truckId: truckId,
            bookingCategoryId: bookingCategoryId,
            location: location,
            parkStayDuration: parkStayDuration,
            parkId: parkId,
            expectedDateOfArrival: expectedDateOfArrival,
            expectedTimeOfArrival: expectedTimeOfArrival,
            addOnService: addOnService,
            journeyCode: stringGenerator(),
            stops: stops,
            journeyCode: generateTransactionRef(6),
            bookingNo: stringGenerator(),
          });
          bookingInstance.referenceNo = bookingInstance._id;
          const response = await bookingInstance.save();
          bookingResponse.push(response);
          await TruckModel.findByIdAndUpdate(truckId, {
            availableForCallUp: false,
          });
        })
      );
      response(res, 201, bookingResponse, "booking response");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

const generateTransactionRef = (number) => {
  return crypto.randomBytes(number).toString("hex");
};

const stringGenerator = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = BookingController;
