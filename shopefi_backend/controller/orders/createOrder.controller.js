const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");
const razorpay = require("../../utils/razorpay");

// Generate Order ID
const generateOrderId = () => {
    return "oid" + Date.now() + Math.floor(Math.random() * 9999);
};

const createOrder = asyncHandler(async (req, res) => {
    try {
        console.log("👉 API HIT: createOrder");

        const { product_ids } = req.body;
        const user_id = req.params.uid;

        console.log("📦 product_ids:", product_ids);
        console.log("👤 user_id:", user_id);

        if (!user_id || !product_ids || product_ids.length === 0) {
            console.log("❌ Invalid input");
            return res.status(400).json({ message: "Invalid order details" });
        }

        const user = await userModel.findOne({ user_id });
        console.log("👤 user:", user);

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const products = await productModel.find({
            product_id: { $in: product_ids }
        });

        console.log("🛒 products:", products);

        if (!products.length) {
            console.log("❌ No products found");
            return res.status(404).json({ message: "No valid products found" });
        }

        // Calculate total amount
      const totalAmount = products.reduce((sum, p) => {
    return sum + Number(p.product_price);
}, 0);

console.log("💰 totalAmount:", totalAmount);
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        console.log("📤 Sending to Razorpay:", options);

        const razorOrder = await razorpay.orders.create(options);

        console.log("✅ Razorpay Order Created:", razorOrder);

        res.status(200).json({
            success: true,
            razorOrder,
            products,
            user
        });

    } catch (err) {
        console.error("🔥 ERROR in createOrder:", err);

        res.status(500).json({
            message: "Order creation failed",
            error: err.message,
            fullError: err   // 👈 VERY IMPORTANT for debugging
        });
    }
});

module.exports = createOrder;