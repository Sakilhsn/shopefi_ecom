const multerModel = require('../../model/multer.config');
const productModel = require('../../model/product.model');
const categoryModel = require('../../model/categoryModel');
const asyncHandler = require("express-async-handler");

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { pname, price, discount, category, description } = req.body;

  // 🔴 Validate required fields
  if (!pname || !price || !discount || !category || !description) {
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

  // 🔍 Find existing product
  const product = await productModel.findOne({ product_id: pid });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // ✅ Handle image
  let imagePath = product.product_image; // default old image

  if (req.file) {
    imagePath = `uploads/${req.file.filename}`;
  }

  // ✅ Update product
  const updatedProduct = await productModel.findOneAndUpdate(
    { product_id: pid },
    {
      $set: {
        product_name: pname,
        product_price: price,
        product_discount: discount,
        product_category: category,
        product_description: description,
        product_image: imagePath,
      },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

module.exports = [multerModel.single('pImage'), updateProduct];