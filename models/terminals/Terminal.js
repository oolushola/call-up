const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TerminalSchema = new Schema({
  portId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Port"
  },
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
    ref: 'Park'
  }],
  dailyCapacity: [{
    bookingCategory: {
      type: Schema.Types.ObjectId,
      ref: 'BookingCategory'
    },
    volume: {
      type: Number,
      default: 0
    }
  }
  ],
  emptyCapacity: [{
    shippingLine: {
      type: String
    },
    _40ftAvailable: {
      type: Number,
      default: 0
    },
    _40ftRemaining: {
      type: Number,
      default: 0
    },
    _20ftAvailable: {
      type: Number,
      default: 0
    },
    _20ftRemaining: {
      type: Number,
      default: 0
    }
  }],
  status: {
    default: true,
    type: Boolean
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Terminal', TerminalSchema)