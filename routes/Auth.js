const express = require('express')
const auth = express.Router();
const AuthController = require('../controllers/Auth');
const { isLoggedIn } = require('../middleware/handlers');
const AuthValidation = require('../middleware/validators/auth')

auth.post('/register',
  AuthValidation.VALIDATE_SIGNUP,
  AuthController.signUp
);

auth.post('/auth/is/click', 
  AuthValidation.VERIFY_EMAIL_CONFIRMATION,
  AuthController.emailTokenConfirmation
)

auth.post('/login', 
  AuthValidation.CHECK_LOGIN,
  AuthController.login
)

auth.post('/auth/password/reset', 
  AuthValidation.CHECK_PASSWORD_RESET,
  AuthController.passwordReset
)

auth.patch(
  '/auth/prl/update',
  AuthValidation.CHECK_PASSWORD_CHANGE,
  AuthController.updateForgottenPassword
)

auth.get(
  '/user/category',
  isLoggedIn,
  AuthController.getUserCategory
)



module.exports = auth
