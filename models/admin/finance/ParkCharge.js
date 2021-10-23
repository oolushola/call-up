const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParkChargeSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  parkCharge: {
    type: Number,
    required: true
  },
  history: {
    updates:[
      {
        lastUpdatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        timestamp: {
          type: Date,
        }
      }
    ]
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('ParkCharge', ParkChargeSchema)