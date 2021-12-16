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
  '/tdo-uploads',
  isLoggedIn,
  isTerminal,
  UploadTdoController.getTdoUploads
)

uploadTdoRoute.post(
  '/upload-tdo',
  isLoggedIn,
  isTerminal,
  UploadTdoController.uploadTdo
)

uploadTdoRoute.put(
  '/upload-tdo/:tdoId',
  isLoggedIn,
  isTerminal,
  UploadTdoController.updateUploadTdo
)

module.exports = uploadTdoRoute
