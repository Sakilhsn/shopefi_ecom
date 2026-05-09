const asyncHandler = require("express-async-handler");
const cartModel = require("../../model/cart.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");

const updateCartQuantity = asyncHandler(async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.params.uid;

        if (!user_id || !product_id || quantity < 1) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const user = await userModel.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cart = await cartModel.findOne({ user_id: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = cart.products.find(
            p => p.product_id.toString() === product_id
        );

        if (!product) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        product.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Quantity updated", cart });

    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

module.exports = updateCartQuantity;