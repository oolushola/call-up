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

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute,
  UserTypeRoute,
  Category,
  TruckCharge,
  ParkCharge,
  TruckType,
  TruckLength
])

module.exports = routes