const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Array,
    required: true,
  },
  isEmailVerified: {
    default: false,
    type: Boolean,
  },
  emailVerifiedAt: {
    type: Date,
    required: false,
  },
  isPhoneNoVerified: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    required: true,
  },
  userAccess: {
    type: Number,
    required: true,
    default: 1
  },
  lastLogin: {
    type: Date,
    default: Date.now()
  },
}, {
  timestamps: true
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
