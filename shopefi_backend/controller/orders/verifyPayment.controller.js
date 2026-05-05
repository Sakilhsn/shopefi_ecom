const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
// Generate Order ID
const generateOrderId = () => {
    return "oid" + Date.now() + Math.floor(Math.random() * 9999);
};
const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        product_ids,
        user_id
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
    }

    // Save order after verification
    const products = await productModel.find({
        product_id: { $in: product_ids }
    });

    const order = await orderModel.create({
        order_id: generateOrderId(),
        user_id,
        product_id: products.map(p => p._id),
        payment_id: razorpay_payment_id,
        status: "paid"
    });

    res.json({ success: true, order });
});
module.exports = verifyPayment;