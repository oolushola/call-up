const TruckTypeModel = require("../../../models/admin/preferences/TruckType");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class TruckTypeController {
  static async allTruckTypes(_, res, _2) {
    try {
      const truckTypes = await TruckTypeModel.find()
        .populate("createdBy history.updates.lastUpdatedBy", "name userType")
        .select("-__v -createdAt -updatedAt")
        .sort({ acronym: "asc" });
      response(res, 200, truckTypes, "truck unions");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTruckType(req, res, _2) {
    try {
      const truckTypeId = req.params.truckTypeId;
      const checkTruckType = await TruckTypeModel.findById(truckTypeId)
        .select("-__v -createdAt -updatedAt")
        .populate("createdBy history.updates.lastUpdatedBy", "name userType");
      if (checkTruckType) {
        return response(
          res,
          200,
          checkTruckType,
          `${checkTruckType.truckType} details`
        );
      }
      response(res, 404, null, "resource not found");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addTruckType(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { truckType } = req.body;
      const checkTruckType = await TruckTypeModel.findOne({
        truckType: truckType,
      }).countDocuments();
      if (checkTruckType > 0) {
        return response(
          res,
          409,
          null,
          `a truck type with "${truckType}" exists`
        );
      }
      const newTruckType = new TruckTypeModel({
        createdBy: req.userId,
        truckType,
        history: {
          updates: [
            {
              lastUpdatedBy: req.userId,
              timestamp: Date.now(),
            },
          ],
        },
      });
      const saveTruckType = await newTruckType.save();
      response(res, 201, saveTruckType, "truck type added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateTruckType(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { truckType } = req.body;
      const { truckTypeId } = req.params;
      const checkRecord = await TruckTypeModel.findOne({
        _id: { $ne: truckTypeId },
      }).where({
        truckType: truckType,
      });
      if (checkRecord)
        return response(
          res,
          409,
          null,
          `${checkRecord.truckType} already exists`
        );
      const updateRecord = await TruckTypeModel.findById(truckTypeId)
      updateRecord.truckType = truckType
      updateRecord.history.updates.push({
        lastUpdatedBy: req.userId,
        timestamp: Date.now()
      })
      const updatedRecord = await updateRecord.save();
      response(
        res,
        201,
        updatedRecord,
        `${updatedRecord.truckType} updated successfully`
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeTruckType(req, res, _) {
    const { truckTypeId } = req.params;
    try {
      const truckType = await TruckTypeModel.findById(truckTypeId);
      if (!truckType) {
        return response(res, 404, {}, "resource not found");
      }
      const deletedRecord = await truckType.remove();
      response(res, 200, deletedRecord, "record deleted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = TruckTypeController;
