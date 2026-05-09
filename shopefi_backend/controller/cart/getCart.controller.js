const asyncHandler = require("express-async-handler");
const cartModel = require("../../model/cart.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");
const getCart = asyncHandler(async (req, res) => {
    try {
        const user_id = req.params.uid;

        if (!user_id) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const user = await userModel.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cart = await cartModel.findOne({ user_id: user._id })
            .populate("products.product_id");
console.log("Cart:", cart);
        res.status(200).json({ cart });

    } catch (error) {
        res.status(500).json({ message: "Fetch cart failed", error: error.message });
    }
});

module.exports = getCart;