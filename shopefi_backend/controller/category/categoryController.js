const categoryModel = require('../../model/categoryModel');
const asyncHandler = require("express-async-handler");

// ✅ Create Category
const createCategory = asyncHandler(async (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    // Check duplicate
    const existing = await categoryModel.findOne({ category_name });
    if (existing) {
        return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await categoryModel.create({ category_name });

    res.status(201).json({
        message: "Category created successfully",
        category: newCategory
    });
});


// ✅ Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find();

    res.status(200).json({
        count: categories.length,
        categories
    });
});


// ✅ Get Single Category
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
});


// ✅ Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
        id,
        { category_name },
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory
    });
});


// ✅ Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await categoryModel.findByIdAndDelete(id);

    if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
        message: "Category deleted successfully"
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};