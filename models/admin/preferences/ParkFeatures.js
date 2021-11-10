const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParkFeaturesSchema = new Schema({
  feature: {
    type: String,
    required: true
  },
  updates: [{
    lastUpdatedBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now()
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('ParkFeature', ParkFeaturesSchema)