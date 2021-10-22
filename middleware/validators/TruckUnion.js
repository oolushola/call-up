const { body } = require('express-validator')

exports.VALIDATE_TRUCK_UNION = [
  body('name')
    .isString()
    .notEmpty()
    .trim(),
  body('acronym')
    .isLength({ max: 8 })
    .isString()
    .trim()
    .notEmpty(),
  body('contact.address')
    .isString()
    .notEmpty()
    .trim(),
  body('contact.email')
    .isEmail()
    .notEmpty()
    .normalizeEmail()
    .trim(),
  body('contact.phoneNos')
    .isArray()
    .isLength({ min: 1 })
];

