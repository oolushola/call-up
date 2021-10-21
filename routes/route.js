const express = require('express')
const routes = express.Router()
const AuthRoute = require('./Auth')
const TruckUnionRoute = require('./TruckUnion')

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute
])

module.exports = routes