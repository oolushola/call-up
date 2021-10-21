const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckUnionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
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