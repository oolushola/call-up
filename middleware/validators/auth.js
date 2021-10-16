const { body } = require("express-validator");
const UserModel = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { response } = require("../../middleware/response");

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
  body("password").isStrongPassword().notEmpty(),
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
  try {
    const emailVerificationToken = req.query.token;
    if (!emailVerificationToken)
      return response(
        res,
        403,
        { verificationToken: null },
        "invalid verification token"
      );
    const validateToken = jwt.verify(
      emailVerificationToken,
      process.env.SECRET_TOKEN
    );
    req.userId = validateToken.id;
    next();
  } catch (err) {
    response(res, 500, err.message, "failed verification");
  }
};
