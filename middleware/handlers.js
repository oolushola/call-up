const jwt = require('jsonwebtoken')
const { response } = require('./response')
require('dotenv').config()
const UserModel = require('../models/User')

exports.GENERATE_TOKEN = (credential, duration) => {
  return jwt.sign(credential, process.env.SECRET_TOKEN, { expiresIn: `${duration}` })
}

exports.VERIFY_TOKEN = async (req, res, next, token) => {
  const checkedToken = token
  if (!checkedToken) {
    return response(
      res, 401, {}, 'unauthorized'
    )
  }
  try {
    const token_ = checkedToken.split(' ')[1]
    const checker = await jwt.verify(token_, process.env.SECRET_TOKEN)
    req.userId = checker.id
    next()
    return checker
  }
  catch (err) {
    response(
      res, 500, err.message, 'oops, something went wrong'
    )
  }
}

exports.isSuperAdmin = async (req, res, next) => {
  const user = await UserModel.findById(req.userId)
  if (user.userType !== "admin" && user.userAccess !== 1) {
    return response(
      res, 403, null, 'access denied'
    )
  }
  next()
}

exports.isAdmin = async (req, res, next) => {
  const user = await UserModel.findById(req.userId)
  if (user.userType !== "admin") {
    return response(
      res, 403, null, 'access denied'
    )
  }
  next()
}

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers['authorization']
    if (!token) {
      return response(
        res, 401, null, 'unauthorized: missing token in request header'
      )
    }
    const userToken = token.split(' ')[1]
    const tokenStatus = jwt.verify(userToken, process.env.SECRET_TOKEN)
    req.userId = tokenStatus.id
    next()
  }
  catch (err) {
    response(
      res, 500, err.message, 'internal server error'
    )
  }
}


exports.isTerminal = async (req, res, next) => {
  try {
    const checkUserType = await UserModel.findById(req.userId);
    if (checkUserType.userType !== "terminal" &&
      checkUserType.userType !== "admin"
    ) {
      return response(
        res, 403, null, 'permission denied'
      )
    }
    next()
  }
  catch (err) {
    response(
      res, 500, err.message, 'internal server errors'
    )
  }
}

exports.walletPrivilege = async (req, res, next) => {
  try {
    const checkUserType = await UserModel.findById(req.userId);
    if (checkUserType.userType !== "transporter" &&
      checkUserType.userType !== "park owner" &&
      checkUserType.userType !== "admin" &&
      checkUserType.userType !== "union" &&
      checkUserType.userType !== "terminal"
    ) {
      return response(
        res, 403, null, 'permission denied'
      )
    }
    next()
  }
  catch (err) {
    response(
      res, 500, err.message, 'internal server errors'
    )
  }
}


