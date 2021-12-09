const TerminalModel = require("../../models/terminals/Terminal");
const { response } = require("../../middleware/response");
const { validationResult } = require("express-validator");

class TerminalController {
  static async getUserTerminal(req, res, next) {
    try {
      const terminal = await TerminalModel.find({ ownedBy: req.userId })
        .select("-__v -createdAt -updatedAt");
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
      const { name, contact, parks, email } = req.body;
      const newTerminalInstance = new TerminalModel({
        ownedBy: req.userId,
        name: name,
        email: email,
        contact: contact,
        parks: parks,
      });
      const saveTerminalInstance = await newTerminalInstance.save()
      response(res, 200, saveTerminalInstance, "terminal added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addPark(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const terminalId = req.params.terminalId
      const parks = req.body.parks
      const terminal = await TerminalModel.findById(terminalId)
      if (!terminal) {
        return response(
          res, 404, null, 'terminal not found'
        )
      }
      parks.map(park => {
        const checkExists = terminal.parks.find(existingPark => existingPark.toString() === park);
        if (!checkExists) terminal.parks.push(park)
      })
      const updateTerminal = await terminal.save()
      response(
        res, 200, updateTerminal, 'park updated'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async getTerminal(req, res, next) {
    try {
      const terminalId = req.params.terminalId
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
        return response(
          res, 422, errors.mapped(), 'validation error'
        )
      }
      const terminalId = req.params.terminalId
      const parks = req.body.parks
      const terminal = await TerminalModel.findById(terminalId)
      if (terminal.parks.length === parks.length) {
        return response(
          res, 406, null, 'unacceptable request'
        )
      }
      parks.map(park => {
        const checkPark = terminal.parks.findIndex(existingPark => existingPark.toString() === park)
        if (checkPark >= 0) terminal.parks.splice(checkPark, 1)
      })
      const updateTerminalParks = await terminal.save()
      response(
        res, 200, updateTerminalParks, 'park removed'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async deleteTerminal(req, res, next) { }
}

module.exports = TerminalController;
