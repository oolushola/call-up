const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckTypeSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  truckType: {
    type: String,
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

module.exports = mongoose.model('TruckType', TruckTypeSchema)

