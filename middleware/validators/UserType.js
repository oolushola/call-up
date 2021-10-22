const { body } = require('express-validator')

exports.VALIDATE_USER_TYPE = [
  body('userType')
    .isString()
    .notEmpty()
    .trim(),
  body('category')
    .isMongoId()
    .notEmpty()
];

