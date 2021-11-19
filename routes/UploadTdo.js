const express = require('express')
const UploadTdoController = require('../controllers/terminal/UploadTdo')
const { isLoggedIn, isTerminal } = require('../middleware/handlers')

const uploadTdoRoute = express.Router()

uploadTdoRoute.get(
  '/tdo-history',
  isLoggedIn,
  isTerminal,
  UploadTdoController.getTdoHistory
)

uploadTdoRoute.get(
  '/pending-match-tdo',
  isLoggedIn,
  isTerminal,
  UploadTdoController.getPendingMatchTdo
)

uploadTdoRoute.post(
  '/upload-tdo',
  isLoggedIn,
  isTerminal,
  UploadTdoController.uploadTdo
)

module.exports = uploadTdoRoute
