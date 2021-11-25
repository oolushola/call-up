const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema({
  ownedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  terminalId: { required: true, type: Schema.Types.ObjectId, ref: 'Terminal' },
  truckId: { required: true, type: Schema.Types.ObjectId, ref: 'Trucks' },
  bookingCategoryId: { required: true, type: Schema.Types.ObjectId, ref: 'BookingCategory' },
  location: { required: true, type: String },
  parkStayDuration: { required: true, type: Number },
  parkId: { required: true, type: Schema.Types.ObjectId, ref: 'Park' },
  expectedDateOfArrival: { required: true, type: String },
  expectedTimeOfArrival: { required: true, type: String },
  stops: [{
    parkId: {
      type: Schema.Types.ObjectId,
      ref: 'Park'
    },
    stayingFor: {
      type: Number
    },
    expectedDateOfArrival: {
      type: String
    },
  }],
  addOnService: [{
    addOn: { type: String, },
    amount: { type: Number },
    days: { type: Number },
    subCharge: { type: Number }
  }],
  journeyCode: { type: String, required: true },
  referenceNo: { type: String, required: true },
  bookingNo: { type: String, required: true }, 
  paymentStatus: { type: Boolean, default: false },
  callOutStatus: { type: Boolean, default: false },
  bookingStatus: { type: Boolean, default: true },
  inParkStatus: { type: Boolean, default: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Booking', BookingSchema);