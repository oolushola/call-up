const BookingModel = require("../models/BookingModel");
const TruckModel = require("../models/transporter/truck");
const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");
const crypto = require("crypto");
const WalletModel = require('../models/Wallet')
const ParkModel = require('../models/Parks/park')

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

      await Promise.all(
        userBookings.map(async (booking) => {
          const userTrucks = await TruckModel.findOne({ ownedBy: req.userId });
          const truckInfo = userTrucks.trucks.find(
            (truck) => truck._id.toString() === booking.truckId.toString()
          );
          bookingResponse.push({ userBookings, truckInfo });
        })
      );
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

  static async removeHoldingBayAddOn(req, res, next) {     
    try {
      const service = req.query.service;
      const bookingId = req.params.bookingId;
      const bookingInfo = await BookingModel.findById(bookingId);
      const serviceIndex = bookingInfo.addOnService.findIndex(
        (addOnservice) => addOnservice.addOn === service
      );
      if (serviceIndex < 0) {
        return response(res, 400, null, "request not allowed");
      }
      bookingInfo.addOnService.splice(serviceIndex, 1);
      const bookingResp = await bookingInfo.save();
      return response(res, 200, {_id: bookingId, ...bookingResp.addOnService}, "addOn removed");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeHoldingBayStop(req, res, next) {
    try {
      const parkId = req.query.stop;
      const bookingId = req.params.bookingId;
      const bookingInfo = await BookingModel.findById(bookingId);
      const stopIndex = bookingInfo.stops.findIndex(
        (park) => park.parkId.toString() === parkId
      );
      if (stopIndex < 0) {
        return response(res, 400, null, "request not allowed");
      }
      bookingInfo.stops.splice(stopIndex, 1);
      const bookingResp = await bookingInfo.save();
      return response(res, 200, {_id: bookingId, ...bookingResp.stops}, "stop removed");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async holdingBayPayment(req, res, next) {
    const paymentMode = req.query.paymentMode
    try {
      const userWallet = await WalletModel.findOne({ userId: req.userId });
      const {
        status,
				transactionRef,
				amount,
        bookingId
      } = req.body
      const bookingInfo = await BookingModel.findOne({ _id: bookingId })
      const parkInfo = await ParkModel.findById(bookingInfo.parkId)
      const truckInfo = await TruckModel.findOne({ ownedBy: req.userId })

      const truckDetails = truckInfo.trucks.find(truck => truck._id.toString() === bookingInfo.truckId.toString())

      if(paymentMode === 'wallet') {
        userWallet.availableBalance -= amount;
        userWallet.lastAmountSpent = amount
      }
      userWallet.transactionHistory.push({
        charges: 0,
        amount: amount,
        commission: 0,
        amountPaid: amount,
        transactionType: "debit",
        modeOfPayment: paymentMode,
        paymentFor: `Park Booking: ${parkInfo.name} for ${truckDetails.plateNo}`,
        transactionStatus: status,
        transactionReference: transactionRef,
        ledgerBalance: userWallet.availableBalance
      })
      const updatedWallet = await userWallet.save()
      if(status === 'success') {
        bookingInfo.paymentStatus = true
        await bookingInfo.save()
      }
      return response(
        res, 201, updatedWallet, 'transaction log updated'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
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
