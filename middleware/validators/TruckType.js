const { body } = require('express-validator')

exports.CHECK_TRUCK_TYPE = [
  body('truckType')
    .isString()
    .notEmpty()
    .trim(),
];

