const TruckUnionModel = require("../models/TruckUnion");
const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");

class TruckUnionController {
  static async allTruckUnions(_, res, _2) {
    try {
      const truckUnions = await TruckUnionModel.find()
        .select("-__v -createdAt -updatedAt")
        .sort({ acronym: "asc" });
      response(res, 200, truckUnions, "truck unions");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTruckUnion(req, res, _2) {
    try {
      const truckUnionId = req.params.truckUnionId
      const checkTruckUnion = await TruckUnionModel.findById(truckUnionId).select('-__v -createdAt -updatedAt')
      if(checkTruckUnion) {
        return response(
          res, 200, checkTruckUnion, `${checkTruckUnion.acronym} details`
        )
      }
      response(
        res, 404, null, 'resource not found'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, "internal server error"
      )
    }
  }

  static async AddTruckUnion(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { name, acronym, contact } = req.body;
      const checkAcronym = await TruckUnionModel.findOne({
        acronym: acronym,
      }).countDocuments();
      if (checkAcronym > 0) {
        return response(res, 409, null, "an acronym already exists");
      }
      const truckUnion = new TruckUnionModel({
        name: name,
        acronym,
        contact: contact,
      });
      const saveTruckUnion = await truckUnion.save();
      response(res, 201, saveTruckUnion, "truck union added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateTruckUnion(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const { name, acronym, contact } = req.body
   
      const { truckUnionId } = req.params
      const checkRecord = await TruckUnionModel
        .findOne({ _id: { $ne: truckUnionId }})
        .where({
          acronym: acronym
        })
        if(checkRecord) return response(
          res, 409, null, `${checkRecord.acronym} exists`
        )
      const updatedRecord = await TruckUnionModel.findByIdAndUpdate({ 
        _id: truckUnionId }, {
        name: name,
        acronym: acronym,
        contact: contact
      })
      console.log(updatedRecord)
      response(
        res, 201, updatedRecord, `${updatedRecord.acronym} updated successfully`
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error',
      )
    }
  }

  static async removeTruckUnion(req, res, _) {
    const { truckUnionId } = req.params
    try {
      const truckUnion = await TruckUnionModel.findById(truckUnionId)
      if(!truckUnion) {
        return response(
          res, 404, {}, 'resource not found'
        )
      }
      const deletedRecord = await truckUnion.remove()
      response(
        res, 200, deletedRecord, 'record deleted'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }
}

module.exports = TruckUnionController;
