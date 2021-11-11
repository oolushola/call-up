const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TerminalSchema = new Schema({
  ownedBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    required: true,
    type: String
  },
  contact: {
    phoneNos: {
      type: Array,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    unique: true,
  },
  parks: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Park'
  }]
})

module.exports = mongoose.model('Terminal', TerminalSchema)