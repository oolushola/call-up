const TerminalModel = require("../../models/terminals/Terminal");
const { response } = require("../../middleware/response");
const { validationResult } = require("express-validator");
const BookingModel = require("../../models/BookingModel");
const TruckModel = require("../../models/transporter/truck");

class TerminalController {
  static async getUserTerminal(req, res, next) {
    try {
      const terminal = await TerminalModel.findOne({
        ownedBy: req.userId,
      }).select("-__v -createdAt -updatedAt");
      if (!terminal) {
        return response(res, 404, null, "resource not found");
      }
      response(res, 200, terminal, "terminal info");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTerminals(req, res, next) {
    try {
      const getTerminals = await TerminalModel.find()
        .select("-__v -createdAt -updatedAt")
        .populate("parks", "_id name parkType")
        .sort({ name: "asc" });
      response(res, 200, getTerminals, "terminals");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addTerminal(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const checkAssociatedTerminal = await TerminalModel.findOne({
        ownedBy: req.userId,
      });
      if (checkAssociatedTerminal) {
        return response(res, 400, null, "operation aborted");
      }
      const { name, contact, email, portId } = req.body;
      const newTerminalInstance = new TerminalModel({
        portId: portId,
        ownedBy: req.userId,
        name: name,
        email: email,
        contact: contact,
      });
      const saveTerminalInstance = await newTerminalInstance.save();
      response(res, 200, saveTerminalInstance, "terminal added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateTerminal(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const terminalId = req.params.terminalId;
      const { name, contact, email, portId } = req.body;
      const terminalInfo = await TerminalModel.findById(terminalId);
      if (!terminalInfo) {
        return response(res, 404, null, "record not found");
      }
      console.log(contact);
      terminalInfo.portId = portId;
      terminalInfo.name = name;
      terminalInfo.email = email;
      terminalInfo.contact = contact;
      const updatedTerminalInfo = await terminalInfo.save();
      response(
        res,
        200,
        updatedTerminalInfo,
        "terminal info updated successfully"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addPark(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const terminalId = req.params.terminalId;
      const parks = req.body.parks;
      const terminal = await TerminalModel.findById(terminalId);
      if (!terminal) {
        return response(res, 404, null, "terminal not found");
      }
      parks.map((park) => {
        const checkExists = terminal.parks.find(
          (existingPark) => existingPark.toString() === park
        );
        if (!checkExists) terminal.parks.push(park);
      });
      const updateTerminal = await terminal.save();
      response(res, 200, updateTerminal, "park updated");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTerminal(req, res, next) {
    try {
      const terminalId = req.params.terminalId;
      const terminal = await TerminalModel.findById(terminalId)
        .populate("park")
        .select("-__v -createdAt -updatedAt");
      if (!terminal) {
        return response(res, 404, null, "resource not found");
      }
      response(res, 200, terminal, "terminal info");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removePark(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors) {
        return response(res, 422, errors.mapped(), "validation error");
      }
      const terminalId = req.params.terminalId;
      const parks = req.body.parks;
      const terminal = await TerminalModel.findById(terminalId);
      if (terminal.parks.length === parks.length) {
        return response(res, 406, null, "unacceptable request");
      }
      parks.map((park) => {
        const checkPark = terminal.parks.findIndex(
          (existingPark) => existingPark.toString() === park
        );
        if (checkPark >= 0) terminal.parks.splice(checkPark, 1);
      });
      const updateTerminalParks = await terminal.save();
      response(res, 200, updateTerminalParks, "park removed");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateDailyCapacity(req, res, next) {
    try {
      const dailyCapacity = req.body.dailyCap;
      const terminalId = req.params.terminalId;
      const terminalInfo = await TerminalModel.findById(terminalId);
      if (!terminalInfo) {
        return response(res, 404, null, "record not found");
      }
      terminalInfo.dailyCapacity = dailyCapacity;
      const updatedTerminal = await terminalInfo.save();
      response(res, 200, updatedTerminal, "changes updated");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateEmptyCapacity(req, res, next) {
    try {
      const emptyCapacity = req.body.emptyCap;
      const terminalId = req.params.terminalId;
      const terminalInfo = await TerminalModel.findById(terminalId);
      if (!terminalInfo) {
        return response(res, 404, null, "record not found");
      }
      terminalInfo.emptyCapacity = emptyCapacity;
      const updatedTerminal = await terminalInfo.save();
      response(res, 200, updatedTerminal, "changes updated");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async bookedTerminal(req, res, next) {
    try {
      const terminalInfo = await TerminalModel.findOne({
        ownedBy: req.userId,
      }).select("_id");
      const trucksBookedTerminal = await BookingModel.find({
        terminalId: terminalInfo._id,
        bookingStatus: true,
        terminalOwnedBy: req.userId,
        paymentStatus: true,
        matchStatus: false
      });

      let myAvailableTrucks = [];
      await Promise.all(
        trucksBookedTerminal.map(async (booking) => {
          const truckInfo = await TruckModel.findOne({
            ownedBy: booking.ownedBy,
          }).select("_id trucks");
          const truck = truckInfo.trucks.find(
            (truckDetail) =>
              truckDetail._id.toString() === booking.truckId.toString()
          );
          if (truck) {
            myAvailableTrucks.push({
              bookingId: booking._id,
              truckId: truck._id,
              plateNo: truck.plateNo,
            });
          }
        })
      );
      response(
        res,
        200,
        myAvailableTrucks,
        "trucks that have booked my terminal"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async deleteTerminal(req, res, next) { }
}

module.exports = TerminalController;
