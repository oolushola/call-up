const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
require("dotenv").config();
const { MAILER } = require("../middleware/mailer");
const { WELCOME_EMAIL } = require("../middleware/join-mail-content");
const tkn = require("../middleware/handlers");
const crypto = require("crypto");
const { PASSWORD_RESET } = require("../middleware/password-reset-link");
const os = require("os");

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
      const token = tkn.GENERATE_TOKEN({ id: user._id }, "24h");
      MAILER(
        email,
        "Welcome to Call Up: Important Next Step!",
        WELCOME_EMAIL(user._id, name, token)
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
    const { _id, email, name, userType } = user._doc;
    MAILER(
      user.email,
      "Call Up: Verification Completed",
      "Thank you for confirming your email."
    );
    response(
      res,
      200,
      { id: _id, email, name, userType, token: req.query.token },
      "email confirmation successful"
    );
  }

  static async login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res, 422, errors.mapped(), "validation failed");
    }
    try {
      const { email, password } = req.body;
      console.log(password);
      const user = await UserModel.findOne({ email: email });
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        return response(res, 401, {}, "invalid login details");
      }
      user.lastLogin = Date.now();
      await user.save();
      const token = tkn.GENERATE_TOKEN({ id: user._id }, "24h");
      response(
        res,
        200,
        {
          name: user.name,
          email: user.email,
          emailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin, 
          token,
          id: user._id,
          userType: user.userType,
        },
        "login successful"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async passwordReset(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res, 422, {}, "email is required");
    }
    try {
      const email = req.body.email;
      const cryptoLink = crypto.randomBytes(16).toString("hex");
      const user = await UserModel.findOne({ email: email });
      const token = tkn.GENERATE_TOKEN({ email: email, id: user._id }, "24h");

      response(res, 200, null, "password reset link sent");

      MAILER(
        email,
        "Call Up: Password Reset Link",
        PASSWORD_RESET(
          user.name,
          os.type(),
          req.headers["user-agent"],
          user.userType,
          cryptoLink,
          token
        )
      );
    } catch (err) {
      response(res, 500, err.message, "internal server errror");
    }
  }

  static async updateForgottenPassword(req, res, next) {
    const passwordResetLink = `bearer ${req.query.upd}`;
    if (!passwordResetLink) {
      return response(res, 400, null, "request not allowed");
    }
    try {
      const userInfo = await tkn.VERIFY_TOKEN(
        req,
        res,
        next,
        passwordResetLink
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.findByIdAndUpdate(
        { _id: userInfo.id },
        { password: hashedPassword }
      );
      response(
        res,
        201,
        {
          email: user.email,
          userType: user.userType,
          updatedAt: user.updatedAt,
        },
        "password changed successfully"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = AuthController;
