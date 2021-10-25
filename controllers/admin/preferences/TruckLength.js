const TruckLengthModel = require("../../../models/admin/preferences/TruckLength");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class TruckLengthController {
  static async allTruckLength(_, res, _2) {
    try {
      const truckLengths = await TruckLengthModel.find()
        .populate("createdBy history.updates.lastUpdatedBy", "name userType")
        .select("-__v -createdAt -updatedAt")
        .sort({ truckLength: "asc" });
      response(res, 200, truckLengths, "truck lengths");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTruckLength(req, res, _2) {
    try {
      const truckLengthId = req.params.truckLengthId;
      const checkTruckLength = await TruckLengthModel.findById(truckLengthId)
        .select("-__v -createdAt -updatedAt")
        .populate("createdBy history.updates.lastUpdatedBy", "name userType");
      if (checkTruckLength) {
        return response(
          res,
          200,
          checkTruckLength,
          `${checkTruckLength.truckLength} details`
        );
      }
      response(res, 404, null, "resource not found");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addTruckLength(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { truckLength } = req.body;
      const checkTruckLength = await TruckLengthModel.findOne({
        truckLength: truckLength,
      }).countDocuments();
      if (checkTruckLength > 0) {
        return response(
          res,
          409,
          null,
          `a truck length with "${truckLength}" exists`
        );
      }
      const newTruckLength = new TruckLengthModel({
        createdBy: req.userId,
        truckLength,
        history: {
          updates: [
            {
              lastUpdatedBy: req.userId,
              timestamp: Date.now(),
            },
          ],
        },
      });
      const saveTruckLength = await newTruckLength.save();
      response(res, 201, saveTruckLength, "truck length added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateTruckLength(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { truckLength } = req.body;
      const { truckLengthId } = req.params;
      const checkRecord = await TruckLengthModel.findOne({
        _id: { $ne: truckLengthId },
      }).where({
        truckLength: truckLength,
      });
      if (checkRecord)
        return response(
          res,
          409,
          null,
          `${checkRecord.truckLength} already exists`
        );
      const updateRecord = await TruckLengthModel.findById(truckLengthId)
      updateRecord.truckLength = truckLength
      updateRecord.history.updates.push({
        lastUpdatedBy: req.userId,
        timestamp: Date.now()
      })
      const updatedRecord = await updateRecord.save();
      response(
        res,
        201,
        updatedRecord,
        `${updatedRecord.truckLength} updated successfully`
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeTruckLength(req, res, _) {
    const { truckLengthId } = req.params;
    try {
      const truckLength = await TruckLengthModel.findById(truckLengthId);
      if (!truckLength) {
        return response(res, 404, {}, "resource not found");
      }
      const deletedRecord = await truckLength.remove();
      response(res, 200, deletedRecord, "record deleted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = TruckLengthController;