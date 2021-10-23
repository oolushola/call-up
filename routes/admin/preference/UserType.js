const express = require('express')
const { VALIDATE_USER_TYPE } = require('../../../middleware/validators/UserType')
const UserTypeController = require('../../../controllers/admin/preferences/UserType')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')

const UserType = express.Router()

UserType.get('/user-types', 
  isLoggedIn,
  UserTypeController.allUserTypes
)

UserType.get('/user-type/:userTypeId',
  isLoggedIn,
  UserTypeController.getUserType
)

UserType.post('/user-type',
  isLoggedIn,
  isAdmin,
  VALIDATE_USER_TYPE,
  UserTypeController.addUserType
)

UserType.put('/user-type/:userTypeId', 
  isLoggedIn,
  isAdmin,
  VALIDATE_USER_TYPE,
  UserTypeController.updateUserType
)

UserType.delete('/user-type/:userTypeId', 
  isLoggedIn,
  isSuperAdmin,
  UserTypeController.removeUserType
)


module.exports = UserType