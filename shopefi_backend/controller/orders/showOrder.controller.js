const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");
const userModel = require("../../model/users.model");
const productModel = require("../../model/product.model");
const mongoose = require("mongoose");

// Get Orders for a Specific User with Joined Data
const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id as ObjectId
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Check if user exists
        const userExists = await userModel.findById(user_id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch orders of the user with product details
        const orders = await orderModel.find({ user_id })
            .populate({
                path: "user_id",
                select: "user_phone"
            })
            .populate({
                path: "product_id",
                select: "product_name product_price product_discount product_image"
            });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        // Formatting order details
        const orderDetails = orders.map(order => ({
            order_id: order.order_id,
            order_date: order.order_date,
            user_phone: order.user_id.user_phone,
            products: order.product_id.map(product => ({
                product_name: product.product_name,
                product_price: product.product_price,
                product_discount: product.product_discount,
                product_image: product.product_image
            }))
        }));

        return res.status(200).json({ user_id, orders: orderDetails });
    } catch (error) {
        console.error("Fetch User Orders Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = getUserOrders;
console.log("User Order Details Controller is working");
