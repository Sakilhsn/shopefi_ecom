const asyncHandler = require("express-async-handler");
const cartModel = require("../../model/cart.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");

const addToCart = asyncHandler(async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.params.uid;

        if (!user_id || !product_id) {
            return res.status(400).json({ message: "Invalid cart data" });
        }

        // Find user
        const user = await userModel.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product
        const product = await productModel.findOne({ product_id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create cart
        let cart = await cartModel.findOne({ user_id: user._id });

        if (!cart) {
            cart = await cartModel.create({
                user_id: user._id,
                products: [{ product_id: product._id, quantity: 1 }]
            });
        } else {
            const existingProduct = cart.products.find(
                p => p.product_id.toString() === product._id.toString()
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product_id: product._id, quantity: 1 });
            }

            await cart.save();
        }

        res.status(200).json({ message: "Product added to cart", cart });

    } catch (error) {
        res.status(500).json({ message: "Add to cart failed", error: error.message });
    }
});

module.exports = addToCart;