const express = require('express')
const { VALIDATE_CATEGORY } = require('../../../middleware/validators/Category')
const CategoryController = require('../../../controllers/admin/preferences/Category')
const { isSuperAdmin, isAdmin, isLoggedIn } = require('../../../middleware/handlers')


const Category = express.Router()

Category.get('/categories', 
  isLoggedIn,
  CategoryController.allCategories
)

Category.get('/category/:categoryId',
  isLoggedIn,
  CategoryController.getCategory
)

Category.post('/category',
  isLoggedIn,
  isAdmin,
  VALIDATE_CATEGORY,
  CategoryController.addCategory
)

Category.put('/category/:categoryId', 
  isLoggedIn,
  isAdmin,
  VALIDATE_CATEGORY,
  CategoryController.updateCategory
)

Category.delete('/category/:categoryId', 
  isLoggedIn,
  isSuperAdmin,
  CategoryController.removeCategory
)


module.exports = Category