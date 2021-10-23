const TruckChargeModel = require("../../../models/admin/finance/TruckCharge");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class TruckChargeController {
  static async TruckCharge(_, res, _2) {
    try {
      const truckCharge = await TruckChargeModel.find()
        .select("-__v -createdAt -updatedAt")
        .populate(
          "createdBy history.updates.lastUpdatedBy",
          "name userType email"
        );
      response(res, 200, truckCharge[0], "truck charge");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addTruckCharge(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { truckCharge } = req.body;
      const checkTruckCharge = await TruckChargeModel.countDocuments();
      let truckChargeInfo;
      if (checkTruckCharge > 0) {
        truckChargeInfo = await TruckChargeModel.findOne({});
        truckChargeInfo.truckCharge = req.body.truckCharge;
        truckChargeInfo.history.updates.push({
          lastUpdatedBy: req.userId,
          timestamp: Date.now()
        });
        const updateTruckCharge = await truckChargeInfo.save();
        return response(
          res, 200, updateTruckCharge, "truck charge updated");
      } else {
        truckChargeInfo = new TruckChargeModel({
          createdBy: req.userId,
          truckCharge,
          history: {
            updates: [{
              lastUpdatedBy: req.userId,
              timestamp: Date.now()
            }]
          },
        });
        const saveTruckCharge = await truckChargeInfo.save();
        response(res, 201, saveTruckCharge, "truck charge added");
      }
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeTruckCharge(req, res, _) {
    const { truckChargeId } = req.params;
    try {
      const truckCharge = await TruckChargeModel.findById(truckChargeId);
      if (!truckCharge) {
        return response(res, 404, {}, "resource not found");
      }
      const deletedRecord = await truckCharge.remove();
      response(res, 200, deletedRecord, "record deleted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = TruckChargeController;
