const AddOnServiceModel = require("../../../models/admin/finance/AddOnService");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class AddOnServiceController {
  static async allAddOnServices(req, res, next) {
    try {
      const addOnServices = await AddOnServiceModel.find()
        .sort({ addOn: "asc" })
        .select('_id addOn amount ')
      response(res, 200, addOnServices, "add-on services");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addOnService(req, res, next) {
    try {
      const { addOnServiceId } = req.params;
      const addOnService = await AddOnServiceModel.findById(
        addOnServiceId
      )
      .populate("updates.lastUpdaredBy", "name");
      if (!addOnService) {
        return response(res, 404, null, "resource not found");
      }
      response(res, 200, addOnService, "add-on service");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async saveAddOnService(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { addOn, amount } = req.body;
      const saveAdOnService = new AddOnServiceModel({
        addOn: addOn,
        amount: amount,
        updates: [
          {
            lastUpdatedBy: req.userId,
          },
        ],
      });
      const saveAdOnServiceResponse = await saveAdOnService.save();
      response(res, 201, saveAdOnServiceResponse, "add-on service added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateAddOnService(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { addOnServiceId } = req.params;
      const { addOn, amount } = req.body;
      const updateAddOnService = await AddOnServiceModel.findById(
        addOnServiceId
      );
      updateAddOnService.addOn = addOn;
      updateAddOnService.amount = amount
      updateAddOnService.updates.push({
        lastUpdatedBy: req.userId,
      });
      const saveaddOnServiceInstance = await updateAddOnService.save();
      response(res, 200, saveaddOnServiceInstance, "updated");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeaddOnService(req, res, next) {}
}

module.exports = AddOnServiceController;
