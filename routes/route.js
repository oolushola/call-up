const express = require('express')
const routes = express.Router()
const AuthRoute = require('./Auth')
const TruckUnionRoute = require('./admin/preference/TruckUnion')
const UserTypeRoute = require('./admin/preference/UserType')
const Category = require('./admin/preference/Category')
const TruckCharge = require('./admin/finance/TruckCharge')

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute,
  UserTypeRoute,
  Category,
  TruckCharge
])

module.exports = routes