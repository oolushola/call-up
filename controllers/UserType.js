const UserTypeModel = require("../models/UserType");
const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");

class UserTypeController {
  static async allUserTypes(_, res, _2) {
    try {
      const userTypes = await UserTypeModel.find()
        .select("-__v -createdAt -updatedAt")
        .populate('category', '-__v -updatedAt -createdAt -_id')
        .sort({ userType: "asc" });
      response(res, 200, userTypes, "user types");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getUserType(req, res, _2) {
    try {
      const { userTypeId } = req.params
      const checkUserType = await UserTypeModel.findById(userTypeId).select('-__v -createdAt -updatedAt')
      if(checkUserType) {
        return response(
          res, 200, checkUserType, `${checkUserType.userType} details`
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

  static async addUserType(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { userType, category } = req.body;
      const checkUserType = await UserTypeModel.findOne({
        userType: userType,
      }).countDocuments();
      if (checkUserType > 0) {
        return response(res, 409, null, "a user type already exists");
      }
      const userTypeInfo = new UserTypeModel({
        userType,
        category,
      });
      const saveUserType = await userTypeInfo.save();
      response(res, 201, saveUserType, "user type added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateUserType(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const { userType, category } = req.body
      const { userTypeId } = req.params
      const checkRecord = await UserTypeModel
        .findOne({ _id: { $ne: userTypeId }})
        .where({
          userType: userType
        })
        if(checkRecord) return response(
          res, 409, null, `${checkRecord.userType} exists`
        )
      const updatedRecord = await UserTypeModel.findByIdAndUpdate({ 
        _id: userTypeId }, {
        userType,
        category
      })
      response(
        res, 201, updatedRecord, `${updatedRecord.userType} updated successfully`
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error',
      )
    }
  }

  static async removeUserType(req, res, _) {
    const { userTypeId } = req.params
    try {
      const userType = await UserTypeModel.findById(userTypeId)
      if(!userType) {
        return response(
          res, 404, {}, 'resource not found'
        )
      }
      const deletedRecord = await userType.remove()
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

module.exports = UserTypeController;
