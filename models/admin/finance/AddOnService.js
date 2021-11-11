const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddOnServiceSchema = new Schema({
  addOn: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
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

module.exports = mongoose.model('AddOnService', AddOnServiceSchema)