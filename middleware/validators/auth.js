const { body } = require("express-validator");
const UserModel = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { VERIFY_TOKEN } = require("../handlers");

exports.VALIDATE_SIGNUP = [
  body("name").isString().notEmpty().trim().toLowerCase(),
  body("email")
    .isEmail()
    .isLowercase()
    .normalizeEmail()
    .custom(async (value, { _ }) => {
      try {
        const user = await UserModel.findOne({ email: value });
        if (user) {
          return Promise.reject({
            statusCode: 409,
            message: "a user with this email already exists",
          });
        }
      } catch (err) {
        throw new err();
      }
    })
    .trim(),
  body("password").isStrongPassword().notEmpty().isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password does not match");
    }
    return true;
  }),
  body("phoneNo").isArray().isLength({ min: 1 }).notEmpty(),
  body("userType").isString().notEmpty().trim().toLowerCase(),
  body("phoneNo"),
];

exports.VERIFY_EMAIL_CONFIRMATION = async (req, res, next) => {
  const confirmationCode = `bearer ${req.query.token}`;
  VERIFY_TOKEN(req, res, next, confirmationCode);
};

exports.CHECK_LOGIN = [
  body("email")
    .isEmail()
    .trim()
    .notEmpty()
    .custom(async (value, { _ }) => {
      const user = await UserModel.findOne({ email: value });
      if (!user)
        return Promise.reject({
          status: 404,
          message: "user not found",
        });
    })
    .normalizeEmail(),
  body("password").isStrongPassword().notEmpty().isLength({ min: 8 }),
];

exports.CHECK_PASSWORD_RESET = [
  body("email")
    .isEmail()
    .trim()
    .notEmpty()
    .custom(async (value, { _ }) => {
      const user = await UserModel.findOne({ email: value });
      if (!user)
        return Promise.reject({
          status: 404,
          message: "user not found",
        });
    })
    .normalizeEmail(),
];

exports.CHECK_PASSWORD_CHANGE = [
  body("password").isStrongPassword().notEmpty().isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password does not match");
    }
    return true;
  }),
];
