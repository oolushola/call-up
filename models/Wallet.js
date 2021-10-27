const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WalletSchema = new Schema({
  availableBalance: {
    required: true,
    type: Number,
    default:0
  },
  lastDeposit: {
    type: Number,
    required: true,
    default: 0
  },
  lastAmountSpent: {
    type: Number,
    required: true,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  transactionHistory: [{
    charges:{
      type: Number
    },
    amount: {
      type: Number
    },
    commission: {
      type: Number
    },
    amountPaid: {
      type: Number
    },
    transactionType: {
      type: String
    },
    timestamp: {
      type: Date
    },
    modeOfPayment: {
      type: String
    },
    ledgerBalance: {
      type: Number
    },
    transactionReference: {
      type: String,
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Wallet', WalletSchema)