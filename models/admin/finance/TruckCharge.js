const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckChargeSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  truckCharge: {
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

const TruckUnionModel = mongoose.model('TruckCharge', TruckChargeSchema)

module.exports = TruckUnionModel