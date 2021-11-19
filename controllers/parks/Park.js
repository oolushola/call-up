const ParkModel = require("../../models/Parks/park");
const TerminalModel = require('../../models/terminals/Terminal')
const { validationResult } = require("express-validator");
const { response } = require("../../middleware/response");
const multer = require('multer');
const crypto = require("crypto");
const cloudinary = require('cloudinary').v2

const filefilter = (req, file, cb) => {
  if(file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" 
  ) {
    cb(null, true)
  }
  else{
    cb(false, null)
  }
}

const upload = multer({ dest: 'uploads/', fileFilter: filefilter }).single('parkImage')

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

  static async addParks(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const referenceNo = crypto.randomBytes(10).toString("hex");
      const entryGateSerialNo = generateSerial();
      const exitGateSerialNo = generateSerial();
      let parkImage;
      if(req.file) {
        parkImage = await cloudinary.uploader.upload(req.file.path, {
          folder: 'parks'
        })
      }
      const {
        name,
        capacity,
        type,
        parkStatus,
        features,
        phoneNos,
        location,
        parkType,
        allowedTerminals
      } = req.body;

      const contact = {
        phoneNos: JSON.parse(phoneNos),
        address: location
      }

      let userAllowedTerminals = JSON.parse(allowedTerminals)
      let terminals = []
      userAllowedTerminals.map(terminal => {
        terminals.push(terminal.id)
      })

      const parkInstance = new ParkModel({
        owner: req.userId,
        referenceNo: referenceNo,
        name: name,
        capacity: capacity,
        profileType: type,
        parkStatus: parkStatus,
        availableSlot: capacity,
        contact: contact,
        parkImage: parkImage.secure_url,
        parkType: parkType,
        entryGateSerialNo: entryGateSerialNo,
        exitGateSerialNo: exitGateSerialNo,
        features: JSON.parse(features),
        allowedTerminals: terminals
      });
      const saveParkInstance = await parkInstance.save();

      await terminals.map(async(terminalId) => {
        const terminal = await TerminalModel.findOne({ _id: terminalId })
        terminal.parks.push(parkInstance._id)
        await terminal.save()
      })

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

module.exports = {
  upload,
  ParkController
};
