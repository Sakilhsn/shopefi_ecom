const asyncHandler = require("express-async-handler");
const cartModel = require("../../model/cart.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");
const removeFromCart = asyncHandler(async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.params.uid;

        if (!user_id || !product_id) {
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

        cart.products = cart.products.filter(
            p => p.product_id.toString() !== product_id
        );

        await cart.save();

        res.status(200).json({ message: "Product removed", cart });

    } catch (error) {
        res.status(500).json({ message: "Remove failed", error: error.message });
    }
});

module.exports = removeFromCart;