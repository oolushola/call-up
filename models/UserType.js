const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserTypeSchema = new Schema({
  userType: {
    required: true,
    type: String
  },
  category: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UserType', UserTypeSchema)