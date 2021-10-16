const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("dotenv").config();
const { MAILER } = require("../middleware/mailer");
const { WELCOME_EMAIL } = require("../middleware/join-mail-content");

class AuthController {
  static async signUp(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { name, email, password, phoneNo, userType } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userInstance = new UserModel({
        name,
        email,
        password: hashedPassword,
        phoneNo,
        userType,
      });

      const user = await userInstance.save();
      const token = jwt.sign(
        { id: user._id, name, email },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      MAILER(
        email,
        "Welcome to Call Up: Important Next Step!",
        WELCOME_EMAIL(user._id, name)
      );
      response(
        res,
        201,
        {
          name,
          email,
          token,
        },
        "successful"
      );
    } catch (err) {
      response(res, 500, err.message, "Internal server error");
    }
  }

  static async emailTokenConfirmation(req, res, next) {
    const user = await UserModel.findByIdAndUpdate(
      { _id: req.userId },
      {
        isEmailVerified: true,
        emailVerifiedAt: Date.now(),
      }
    );
    MAILER(
      user.email,
      "Call Up Email Verification: Completed ",
      "Thank you for confirming your email."
    );
    response(res, 200, null, "email confirmation successful");
  }
}

module.exports = AuthController;
