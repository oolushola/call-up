const { body } = require('express-validator')

exports.CHECK_FUND = [
  body('amount')
    .isFloat()
    .notEmpty()
    .trim()
]