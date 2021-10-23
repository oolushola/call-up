const CategoryModel = require("../../../models/admin/preferences/Category");
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class CategoryController {
  static async allCategories(_, res, _2) {
    try {
      const categories = await CategoryModel.find()
        .select("-__v -createdAt -updatedAt")
        .sort({ category: "asc" });
      response(res, 200, categories, "categories");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getCategory(req, res, _2) {
    try {
      const { categoryId } = req.params
      const checkCategory = await CategoryModel.findById(categoryId).select('-__v -createdAt -updatedAt')
      if(checkCategory) {
        return response(
          res, 200, checkCategory, `${checkCategory.category} details`
        )
      }
      response(
        res, 404, null, 'resource not found'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, "internal server error"
      )
    }
  }

  static async addCategory(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { category } = req.body;
      const checkCategory = await CategoryModel.findOne({category: category}).countDocuments();
      if (checkCategory > 0) {
        return response(res, 409, null, "category already exists");
      }
      const categoryInfo = new CategoryModel({category: category});
      const saveCategory = await categoryInfo.save();
      response(res, 201, saveCategory, "user type added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return response(
          res, 422, errors.mapped(), 'validation failed'
        )
      }
      const { category } = req.body
      const { categoryId } = req.params
      const checkRecord = await CategoryModel
        .findOne({ _id: { $ne: categoryId }})
        .where({
          category: category
        })
        if(checkRecord) return response(
          res, 409, null, `${checkRecord.category} exists`
        )
      const updatedRecord = await CategoryModel.findByIdAndUpdate({ 
        _id: categoryId }, {
        category,
        status
      })
      response(
        res, 201, updatedRecord, `${updatedRecord.category} updated successfully`
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error',
      )
    }
  }

  static async removeCategory(req, res, _) {
    const { categoryId } = req.params
    try {
      const category = await CategoryModel.findById(categoryId)
      if(!category) {
        return response(
          res, 404, {}, 'resource not found'
        )
      }
      const deletedRecord = await category.remove()
      response(
        res, 200, deletedRecord, 'record deleted'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error'
      )
    }
  }
}

module.exports = CategoryController;
