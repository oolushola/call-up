const { body } = require('express-validator')
const TruckUnionModel = require('../../models/TruckUnion')

exports.VALIDATE_TRUCK_UNION = [
  body('name')
    .isString()
    .notEmpty()
    .trim(),
  body('title')
    .isLength({ max: 8 })
    .isString()
    .trim()
    .notEmpty(),
  body('contact.*.address')
    .isString()
    .notEmpty()
    .trim(),
  body('contact.*.email')
    .isEmail()
    .notEmpty()
    .trim(),
  body('contact.*.phoneNos')
    .isArray()
    .isLength({ min: 1 })
];

