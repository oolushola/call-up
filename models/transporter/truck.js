const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckSchema = new Schema({
  ownedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trucks: [{
    truckName: {
      required: true,
      type: String
    },
    truckModel: {
      required: true,
      type: String
    },
    plateNo: {
      required: true,
      type: String
    },
    chasisNo: {
      required: true,
      type: String
    },
    truckType: {
      required: true,
      type: String,
      ref: 'TruckType'
    },
    union: {
      type: Schema.Types.ObjectId,
      ref: 'TruckUnion'
    },
    length: {  
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'TruckLength'
    },
    color: {
      required: true,
      type: String
    },
    truckImage: { 
      type: String
    },
    qrCode: {
      type: String,
      required: true
    },
    stickerStatus: {
      type: Boolean,
      default: false
    },
    truckStatus: {
      type: String // tells the truck status 
    },
    paymentStatus: {
      type: Boolean,
      required: true,
      default: false
    },
    stage: {
      type: String,
      required: true,
      default: 'pending verification'
    },
    verificationStatus: {
      type: Boolean,
      required: true,
      default: false
    },
    dateVerified: {
      type: Date
    },
    activationStatus: {
      type: Boolean,
      default: true // depends if the owner wants to make active or inactive.
    },
    availableForCallUp: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
})

const TruckModel = mongoose.model('Trucks', TruckSchema)

module.exports = TruckModel

