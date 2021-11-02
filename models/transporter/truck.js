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
    chasisNumber: {
      required: true,
      type: String
    },
    truckType: {
      required: true,
      type: String
    },
    union: {
      type: Schema.Types.ObjectId,
      ref: 'TruckUnion'
    },
    truckLength: {  
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
      type: String
    }
  }]
}, {
  timestamps: true
})

mongoose.model('Trucks', TruckSchema)