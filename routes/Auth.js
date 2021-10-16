const express = require('express')
const auth = express.Router();
const AuthController = require('../controllers/Auth')
const AuthValidation = require('../middleware/validators/auth')


auth.post('/register',
  AuthValidation.VALIDATE_SIGNUP,
  AuthController.signUp
);

auth.post('/auth/is/click', 
  AuthValidation.VERIFY_EMAIL_CONFIRMATION,
  AuthController.emailTokenConfirmation
)



module.exports = auth
