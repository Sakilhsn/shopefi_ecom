const multerModel = require('../../model/multer.config');
const productModel = require('../../model/product.model');
const baseurl = require('../../model/baseurl');
const asyncHandler = require("express-async-handler");

// Generate Product ID
const generateProductId = () => {
    return "pid" + Date.now() + Math.floor(Math.random() * 9999);
};

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { pname, price, discount, category, description } = req.body;
        
        if (!pname || !price || !discount || !category || !description || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = await productModel.create({
            product_id: generateProductId(),
            product_name: pname,
            product_price: price,
            product_discount: discount,
            product_category: category,
            product_description: description,
            product_image: `uploads/${req.file.filename}`
        });

        return res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});
module.exports = [multerModel.single('pImage'), addProduct];
console.log("Product Controller is working");
