const express = require('express');
const categoryRouter = express.Router();

const adminAuth = require('../middleware/adminAuth');

// ✅ Import all controllers correctly
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controller/category/categoryController');


// ✅ Get All Categories
categoryRouter.get('/show',adminAuth, getAllCategories);

// ✅ Get Category By ID
categoryRouter.get('/show/:id', getCategoryById);


// ✅ Add Category (Admin)
categoryRouter.post('/add', adminAuth, createCategory);


// ✅ Update Category (Admin)
categoryRouter.put('/update/:id', adminAuth, updateCategory);


// ✅ Delete Category (Admin)
categoryRouter.delete('/delete/:id', adminAuth, deleteCategory);


module.exports = categoryRouter;

console.log("Category Router is working....");