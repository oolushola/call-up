const ParkFeatureModel = require('../../../models/admin/preferences/ParkFeatures')
const { validationResult } = require('express-validator')
const { response } = require('../../../middleware/response')

class ParkFeaturesController {
  static async getAllParkFeatures(req, res, next) {
    try {
      const features = await ParkFeatureModel
        .find()
        .sort({ feature: 'asc'})
        .populate('updates.lastUpdatedBy', 'name')
        response(
          res, 200, features, 'park features'
        )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async parkFeature(req, res, next) {
    try {
      const { parkFeatureId } = req.params
      const parkFeatures = await ParkFeatureModel.findById(parkFeatureId).populate('updates.lastUpdaredBy', 'name')
      if(!parkFeatures) {
        return response(res, 404, null, 'resource not found')
      }
      response(
        res, 200, parkFeatures, 'park feature'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async addParkFeature(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const { feature } = req.body 
      const addFeature = new ParkFeatureModel({
        feature: feature,
        updates: [{
          lastUpdatedBy: req.userId
        }]
      })
      const addFeatureResponse = await addFeature.save()
      response(
        res, 201, addFeatureResponse, 'feature added'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async updateParkFeature(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const { parkFeatureId } = req.params
      const { feature } = req.body
      const updateParkFeature = await ParkFeatureModel.findById(parkFeatureId)
      updateParkFeature.feature = feature
      updateParkFeature.updates.push({
        lastUpdatedBy: req.userId,
      })
      const saveFeatureInstance = await updateParkFeature.save()
      response(
        res, 200, saveFeatureInstance, 'updated'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }

  static async removeParkFeature(req, res, next) {

  }
}

module.exports = ParkFeaturesController