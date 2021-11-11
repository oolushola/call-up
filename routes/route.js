const express = require('express')
const routes = express.Router()
const AuthRoute = require('./Auth')
const TruckUnionRoute = require('./admin/preference/TruckUnion')
const UserTypeRoute = require('./admin/preference/UserType')
const Category = require('./admin/preference/Category')
const TruckCharge = require('./admin/finance/TruckCharge')
const ParkCharge = require('./admin/finance/ParkCharge')
const TruckType = require('./admin/preference/TruckType')
const TruckLength = require('./admin/preference/TruckLength')
const Wallet = require('./Wallet')
const Truck = require('./Truck')
const ParkFeature = require('./admin/preference/ParkFeatures')
const Park = require('./Park')
const BookingCategory = require('./admin/preference/BookingCategory')
const Terminal = require('./Terminal')

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute,
  UserTypeRoute,
  Category,
  TruckCharge,
  ParkCharge,
  TruckType,
  TruckLength,
  Wallet,
  Truck,
  ParkFeature,
  Park,
  BookingCategory,
  Terminal
])

module.exports = routes