const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ParkSchema = new Schema({
  owner: { required: true, type: Schema.Types.ObjectId },
  referenceNo: { required: true, type: String },
  name: { required: true, type: String },
  capacity: { required: true, type: Number },
  contact: {
    phoneNos: { required: true, type: Array },
    address: { required: true, type: String },
  },
  parkImage: {
    type: String
  },
  profileType: { required: true, type: Schema.Types.ObjectId, ref: 'Category' },
  parkStatus: { required: true, type: Boolean, default: true },
  availableSlot: { type: Number },
  entryGateSerialNo: { required: true, type: String },
  exitGateSerialNo: { required: true, type: String },
  features:[{
    featureId: {
      type: Schema.Types.ObjectId,
      ref: 'ParkFeature'
    }
  }],
  allowedTerminals: {
    required: true,
    type: Array,
    ref: 'Terminal'
  },
  parkType: {
    required: true,
    type: Array
  },
  lock: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Park', ParkSchema)