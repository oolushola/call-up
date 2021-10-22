const { body } = require('express-validator')

exports.VALIDATE_CATEGORY = [
  body('category')
    .isString()
    .notEmpty()
    .trim()
];

