const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PortSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true
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
})

module.exports = mongoose.model("Port", PortSchema)