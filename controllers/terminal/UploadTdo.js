const { validationResult } = require('express-validator')
const { response } = require('../../middleware/response')
const UploadTdoModel = require('../../models/terminals/UploadTdo')


class UploadTdoController {

  static async getTdoHistory(req, res, next) {
    try {
      const tdoHistories = await UploadTdoModel
      .find({ uploadedBy: req.userId })
      .sort({ createdAt: 'asc' })
      .populate('bookingId terminalId clearingAgentId', 'name')
      .select('-__v')
      response(
        res, 200, tdoHistories, 'tdo history listings'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async getPendingMatchTdo(req, res, next) {
    try {
      const tdoPendingMatched = await UploadTdoModel
      .find({ uploadedBy: req.userId, matchedStatus: false })
      .populate('uploadedBy terminalId clearingAgentId', 'name')
      .select('transNo  matchStatus containerNo containerType lineOperator size weight location createdAt')
      response(
        res, 200, tdoPendingMatched, 'tdo pending matched'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async uploadTdo(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(
        res, 422, errors.mapped(), 'validation failed'
      )
    }
    try {
      const {
        terminalId,
        clearingAgentId,
        transNo,
        containerType,
        lineOperator,
        containerNo,
        size,
        weight,
        location
      } = req.body

      const checkTdo = await UploadTdoModel.findOne({ containerNo: containerNo })
      if (checkTdo) {
        return response(
          res, 409, 'conflict', 'possible duplicate container no'
        )
      }
      const uploadedTdoInstance = new UploadTdoModel({
        uploadedBy: req.userId,
        terminalId: terminalId,
        clearingAgentId: clearingAgentId,
        transNo: transNo,
        containerType: containerType,
        lineOperator: lineOperator,
        containerNo: containerNo,
        size: size,
        weight: weight,
        location: location
      })
      const uploadTdo = await uploadedTdoInstance.save()
      response(
        res, 201, uploadTdo, 'uploaded tdo'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }
}

module.exports = UploadTdoController