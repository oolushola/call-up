const express = require('express')
const routes = express.Router()
const AuthRoute = require('./Auth')
const TruckUnionRoute = require('./TruckUnion')
const UserTypeRoute = require('./UserType')
const Category = require('./Category')

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute,
  UserTypeRoute,
  Category
])

module.exports = routes