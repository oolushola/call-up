const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UploadTdoSchema = new Schema({
  uploadedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  terminalId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Terminal'
  },
  tdoNo: {
    required: true,
    type: String
  },
  size: {
    required: true,
    type: String
  },
  containerCategory: {
    required: true,
    type: String
  },
  shippingLine: {
    required: true,
    type: String
  },
  containerNos: {
    required: true,
    type: Array
  },
  plateNo: {
    type: String,
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  matchedStatus: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  dateMatched: {
    type: Date,
    default: Date.now()
  },
  dateCalledOut: {
    type: String
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('UploadTdo', UploadTdoSchema)