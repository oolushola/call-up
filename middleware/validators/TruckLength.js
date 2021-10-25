const { body } = require('express-validator')

exports.CHECK_TRUCK_LENGTH = [
  body('truckLength')
    .isString()
    .notEmpty()
    .trim(),
];

