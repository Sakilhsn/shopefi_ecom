// models/categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, "category name required"],
    unique: true,
    trim: true
  }
}, { versionKey: false });

module.exports = mongoose.model("categoryModel", categorySchema, "categories");