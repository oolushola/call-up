const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckUnionSchema = new Schema({
  ownedBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  acronym: {
    type: String,
    required: true
  },
  contact: {
    address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNos: {
      type: Array,
      required: true
    }
  }
}, {
  timestamps: true
})

const TruckUnionModel = mongoose.model('TruckUnion', TruckUnionSchema)

module.exports = TruckUnionModel