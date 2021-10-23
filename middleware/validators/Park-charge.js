const { body } = require('express-validator')

exports.CHECK_PARK_CHARGE = [
  body('parkCharge')
    .isFloat()
    .notEmpty()
];

