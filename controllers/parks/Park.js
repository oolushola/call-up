const ParkModel = require("../../models/Parks/park");
const { validationResult } = require("express-validator");
const { response } = require("../../middleware/response");
const crypto = require("crypto");

class ParkController {
  static async allParks(req, res, next) {
    try {
      const limit = req.query.limit || process.env.PER_PAGE;
      const currentPage = req.query.page || process.env.CURRENT_PAGE;
      const skip = (currentPage - 1) * currentPage;
      const allParks = await ParkModel.find()
        .populate("profileType features.featureId", "category feature")
        .sort({ name: "asc" })
        .skip(skip)
        .limit(limit);
      response(
        res, 200, allParks, 'all parks'
      )
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async userPark(req, res, next) {
    try {
      const limit = req.query.limit || process.env.PER_PAGE;
      const currentPage = req.query.page || process.env.CURRENT_PAGE;
      const skip = (currentPage - 1) * currentPage;
      const userParks = await ParkModel.find({ owner: req.userId })
        .populate("profileType features.featureId", "category feature")
        .sort({ name: "asc" })
        .skip(skip)
        .limit(limit);
      response(
        res, 200, userParks, 'user parks'
      )
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async viewPark(req, res, next) {}

  static async addParks(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const referenceNo = crypto.randomBytes(10).toString("hex");
      const entryGateSerialNo = generateSerial();
      const exitGateSerialNo = generateSerial();
      const {
        name,
        capacity,
        type,
        parkStatus,
        features,
        availableSlot,
        contact,
      } = req.body;
      const parkInstance = new ParkModel({
        owner: req.userId,
        referenceNo: referenceNo,
        name: name,
        capacity: capacity,
        profileType: type,
        parkStatus: parkStatus,
        avaiilableSlot: availableSlot,
        contact: contact,
        entryGateSerialNo: entryGateSerialNo,
        exitGateSerialNo: exitGateSerialNo,
        features: features,
      });
      console.log(parkInstance);
      const saveParkInstance = await parkInstance.save();
      response(res, 201, saveParkInstance, "park added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

const generateSerial = () => {
  let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    serialLength = 10,
    randomSerial = "",
    i,
    randomNumber;
  for (i = 0; i < serialLength; i = i + 1) {
    randomNumber = Math.floor(Math.random() * chars.length);
    randomSerial += chars.substring(randomNumber, randomNumber + 1);
  }
  return randomSerial;
};

module.exports = ParkController;
