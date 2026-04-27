const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");

// Generate Order ID
const generateOrderId = () => {
    return "oid" + Date.now() + Math.floor(Math.random() * 9999);
};

const placeOrder = asyncHandler(async (req, res) => {
    try {
        const { product_ids } = req.body;
        const user_id = req.params.uid;

        if (!user_id || !product_ids || product_ids.length === 0) {
            return res.status(400).json({ message: "Invalid order details" });
        }

        // Find the user by user_id (not _id)
        const user = await userModel.findOne({ user_id: user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the products by product_id
        const products = await productModel.find({ product_id: { $in: product_ids } });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No valid products found" });
        }

        // Create the order
        const orderInfo = await orderModel.create({
            order_id: generateOrderId(),
            user_id: user._id,
            product_id: products.map(p => p._id),
        });

        res.status(201).json({ message: "Order placed successfully", orderInfo });
    } catch (error) {
        res.status(500).json({ message: "Order failed", error: error.message });
    }
});
// Place an Order
// const placeOrder = asyncHandler(async (req, res) => {
//     try {
//         const { user_id, product_id, user_email, user_phone, user_name } = req.body;

//         if (!user_id || !product_id || !user_email || !user_phone || !user_name) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
//         const userExists = await userModel.findById(user_id);
//         if (!userExists) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const productsExist = await productModel.find({ _id: { $in: product_id } });
//         if (productsExist.length !== product_id.length) {
//             return res.status(404).json({ message: "Some products not found" });
//         }
//         const newOrder = await orderModel.create({
//             order_id: generateOrderId(),
//             user_id,
//             product_id,
//             user_email,
//             user_phone,
//             user_name,
//             order_date: Date.now()
//         });

//         return res.status(201).json({ message: "Order placed successfully", order: newOrder });
//     } catch (error) {
//         console.error("Order Placement Error:", error);
//         return res.status(500).json({ message: "Internal server error", error });
//     }
// });



module.exports =  placeOrder;

