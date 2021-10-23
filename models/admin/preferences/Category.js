const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  category: {
    required: true,
    type: String
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Category', CategorySchema)