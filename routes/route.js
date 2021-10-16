const express = require('express')
const routes = express.Router()
const AuthRoute = require('./Auth')

routes.use(process.env.BASE_URL, [
  AuthRoute
])

module.exports = routes