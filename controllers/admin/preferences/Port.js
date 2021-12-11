const { validationResult } = require('express-validator')
const PortModel = require("../../../models/admin/preferences/Port")
const { response } = require('../../../middleware/response')

class Port {
  static async addPort(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return response(
        res, 422, errors.mapped(), 'validation failed'
      )
    }
    try {
      const { name, address } = req.body
      const portInstance = new PortModel({
        name: name,
        address: address,
        updates: [{
          lastUpdatedBy: req.userId,
        }]
      })
      const portRecord = await portInstance.save()
      return response(
        res, 201, portRecord, 'added successfully'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async allPorts(req, res, next) {
    try {
      const ports = await PortModel.find({}).sort({ name: 'asc' }).select("-__v -createdAt -updatedAt")
      response(
        res, 200, ports, 'all ports'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async port(req, res, next) {
    const portId = req.parms.portId
    try {
      const portInfo = await PortModel.findById(portId).select("-__v -createdAt")
      return response(
        res, 200, portInfo, 'port details'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async updatePort(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(
        res, 422, errors.mapped(), 'validation failed'
      )
    }
    try {
      const portId = req.params.portId
      const portInfo = await PortModel.findById(portId)
      if (!portInfo) {
        return response(
          res, 404, null, 'record not found'
        )
      }
      const { name, address } = req.body
      portInfo.name = name
      portInfo.address = address
      portInfo.updates.push({
        lastUpdatedBy: req.userId
      })
      const updatedPort = await portInfo.save()
      response(
        res, 200, updatedPort, 'port record updated'
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async togglePortStatus(req, res, next) {
    try {
      const portId = req.params.portId
      const portInfo = await PortModel.findById(portId)
      portInfo.status = !portInfo.status
      const portUpdatedStatus = await portInfo.save()
      response(
        res, 200, portUpdatedStatus, "port status changed"
      )
    }
    catch (err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }
}

module.exports = Port