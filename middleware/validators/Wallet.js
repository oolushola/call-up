const { body } = require('express-validator')

exports.CHECK_FUND = [
  body('amount')
    .isFloat()
    .notEmpty()
    .trim()
]

exports.CHECK_DEBIT = [
  body('amount')
    .isFloat()
    .notEmpty()
    .trim(),
  body('modeOfPayment')
    .isString()
    .notEmpty()
    .trim()
]