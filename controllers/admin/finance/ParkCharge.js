const ParkChargeModel = require("../../../models/admin/finance/ParkCharge");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class ParkChargeController {
  static async parkCharge(req, res, _2) {
    try {
      const parkCharge = await ParkChargeModel.findOne({})
        .select("-__v -createdAt -updatedAt")
        .populate(
          "createdBy history.updates.lastUpdatedBy",
          "name userType email"
        );
      response(res, 200, parkCharge, "park charge");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addParkCharge(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { parkCharge } = req.body;
      const checkParkCharge = await ParkChargeModel.countDocuments();
      let parkChargeInfo;
      if (checkParkCharge > 0) {
        parkChargeInfo = await ParkChargeModel.findOne({});
        parkChargeInfo.parkCharge = req.body.parkCharge;
        parkChargeInfo.history.updates.push({
          lastUpdatedBy: req.userId,
          timestamp: Date.now()
        });
        const updateParkCharge = await parkChargeInfo.save();
        return response(
          res, 200, updateParkCharge, "park charge updated");
      } else {
        parkChargeInfo = new ParkChargeModel({
          createdBy: req.userId,
          parkCharge,
          history: {
            updates: [{
              lastUpdatedBy: req.userId,
              timestamp: Date.now()
            }]
          },
        });
        const saveParkCharge = await parkChargeInfo.save();
        response(res, 201, saveParkCharge, "park charge added");
      }
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeParkCharge(req, res, _) {
    const { parkChargeId } = req.params;
    try {
      const parkCharge = await ParkChargeModel.findById(parkChargeId);
      if (!parkCharge) {
        return response(res, 404, {}, "resource not found");
      }
      const deletedRecord = await parkCharge.remove();
      response(res, 200, deletedRecord, "record deleted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = ParkChargeController;
