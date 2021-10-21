const jwt = require('jsonwebtoken')
const { response } = require('./response')
require('dotenv').config()

exports.GENERATE_TOKEN = (credential, duration) => {
  return jwt.sign(credential, process.env.SECRET_TOKEN, { expiresIn: `${duration}`})
}

exports.VERIFY_TOKEN = async (req, res, next, token) => {
  const checkedToken = token
  if(!checkedToken) {
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
  catch(err) {
    response(
      res, 500, err.message, 'oops, something went wrong'
    )
  }
}

exports.SUPER_ADMIN = async (req, res, next) => {
  const user = await UserModel.findById(req.userId)
  if(user.userType !== "admin" && user.accessControl !== 1) {
    return response(
      res, 403, null, 'access denied'
    )
  }
  next()
}

exports.IS_ADMIN = async (req, res, next) => {
  const user = await UserModel.findById(req.userId)
  if(user.userType !== "admin" && user.accessControl !== 1) {
    return response(
      res, 403, null, 'access denied'
    )
  }
  next()
}

