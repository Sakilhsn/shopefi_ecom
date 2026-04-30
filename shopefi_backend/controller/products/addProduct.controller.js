const multerModel = require('../../model/multer.config');
const productModel = require('../../model/product.model');
const categoryModel = require('../../model/categoryModel');
const baseurl = require('../../model/baseurl');
const asyncHandler = require("express-async-handler");

// ✅ Generate Product ID
const generateProductId = () => {
    return "pid" + Date.now() + Math.floor(Math.random() * 9999);
};


// ✅ ADD PRODUCT
const addProduct = asyncHandler(async (req, res) => {

    const { pname, price, discount, category, description } = req.body;

    // 🔴 Required field validation
    if (!pname || !price || !discount || !category || !description || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 🔴 Discount validation
    if (discount <= 0 || discount > 99) {
        return res.status(400).json({ message: "Discount must be between 0 and 99" });
    }

    // 🔴 Check category exists
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
        return res.status(404).json({ message: "Invalid category ID" });
    }

    // ✅ Create product
    const newProduct = await productModel.create({
        product_id: generateProductId(),
        product_name: pname,
        product_price: price,
        product_discount: discount,
        product_category: category,
        product_description: description,
            product_image: `uploads/${req.file.filename}`
    });

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});


// ✅ EXPORT (multer + controller)
module.exports = [multerModel.single('pImage'), addProduct];

console.log("Product Controller is working");