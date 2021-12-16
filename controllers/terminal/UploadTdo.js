const { validationResult } = require('express-validator')
const { response } = require('../../middleware/response')
const UploadTdoModel = require('../../models/terminals/UploadTdo')
const BookingModel = require("../../models/BookingModel")
const TerminalModel = require("../../models/terminals/Terminal")

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
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async getTdoUploads(req, res, next) {
    try {
      const terminal = await TerminalModel.findOne({ ownedBy: req.userId })
      const uploadedTdos = await UploadTdoModel
        .find({ terminalId: terminal._id })
        .sort({ dateMatched: 'asc' })
        .populate('uploadedBy terminalId', 'name')
        .select('-__v -updatedAt')
      response(
        res, 200, uploadedTdos, 'matched tdo'
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
        tdoNo,
        containerCategory,
        shippingLine,
        containerNos,
        size,
        bookingId,
        plateNo
      } = req.body

      const bookingInfo = await BookingModel.findById(bookingId)
      const checkTdo = await UploadTdoModel.findOne({ bookingId: bookingId })
      if (checkTdo) {
        return response(
          res, 409, 'conflict', 'possible duplicate tdo no'
        )
      }
      const uploadedTdoInstance = new UploadTdoModel({
        uploadedBy: req.userId,
        terminalId: bookingInfo.terminalId,
        tdoNo: tdoNo,
        containerCategory: containerCategory,
        shippingLine: shippingLine,
        containerNos: containerNos,
        size: size,
        bookingId: bookingId,
        plateNo: plateNo
      })
      const uploadTdo = await uploadedTdoInstance.save()
      bookingInfo.matchStatus = true
      await bookingInfo.save()
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

  static async updateUploadTdo(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(
        res, 422, errors.mapped(), 'validation failed'
      )
    }
    try {
      const {
        tdoNo,
        containerCategory,
        shippingLine,
        containerNos,
        size,
      } = req.body
      const tdoId = req.params.tdoId
      const uploadedTdo = await UploadTdoModel.findById(tdoId)
      uploadedTdo.tdoNo = tdoNo
      uploadedTdo.size = size
      uploadedTdo.containerCategory = containerCategory;
      uploadedTdo.shippingLine = shippingLine
      uploadedTdo.containerNos = containerNos
      const uploadedTdoResult = await uploadedTdo.save()
      return response(
        res, 200, uploadedTdoResult, "tdo updated"
      )
    }
    catch (err) {
      response(res, 500, err.message, 'internal server error')
    }
  }
}

module.exports = UploadTdoController