const { body } = require('express-validator')

exports.CHECK_TRUCK_CHARGE = [
  body('truckCharge')
    .isFloat()
    .notEmpty()
];

