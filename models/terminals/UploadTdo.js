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
  clearingAgentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  transNo: {
    required: true,
    type: String
  },
  containerType: {
    required: true,
    type: String
  },
  lineOperator: {
    required: true,
    type: String
  },
  containerNo: {
    required: true,
    type: String
  },
  size: {
    required: true,
    type: String
  },
  weight: {
    required: true,
    type: Number
  },
  location: {
    type: String    
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  matchedStatus: {
    type: Boolean,
    default: false,
  },
  callOutStatus: {
    type: Boolean,
    default: false
  },
  dateMatched: {
    type: String
  },
  dateCalledOut: {
    type: String
  },
  tdoImage: {
    type: String
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('UploadTdo', UploadTdoSchema)