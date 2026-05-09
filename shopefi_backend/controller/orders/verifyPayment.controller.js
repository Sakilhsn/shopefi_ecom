const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");
const productModel = require("../../model/product.model");
const userModel = require("../../model/users.model");
const cartModel = require("../../model/cart.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
// Generate Order ID
const generateOrderId = () => {
    return "oid" + Date.now() + Math.floor(Math.random() * 9999);
};

const verifyPayment = asyncHandler(async (req, res) => {
    console.log("👉 API HIT: verifyPayment");

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        product_ids,
        user_id
    } = req.body;

    console.log("📥 Incoming Data:");
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_signature:", razorpay_signature);
    console.log("product_ids:", product_ids);
    console.log("user_id (from frontend):", user_id);

    // 🔐 Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    console.log("🔐 Expected Signature:", expectedSignature);

    if (expectedSignature !== razorpay_signature) {
        console.log("❌ Signature mismatch!");
        return res.status(400).json({ message: "Invalid signature" });
    }

    console.log("✅ Signature verified");

    // 🔍 Find user by custom user_id
    const user = await userModel.findOne({ user_id });

    console.log("👤 User from DB:", user);

    if (!user) {
        console.log("❌ User not found in DB");
        return res.status(404).json({ message: "User not found" });
    }

    console.log("🆔 Mongo _id:", user._id);

    // 🔍 Fetch products
    const products = await productModel.find({
        product_id: { $in: product_ids }
    });

    console.log("🛒 Products fetched:", products);

    if (!products.length) {
        console.log("❌ No products found");
        return res.status(404).json({ message: "No products found" });
    }

    // 💾 Create order
    console.log("💾 Creating order with:");
    console.log({
        order_id: "generated",
        user_id: user._id, // IMPORTANT FIX
        product_ids: products.map(p => p._id),
        payment_id: razorpay_payment_id
    });

    const order = await orderModel.create({
        order_id: generateOrderId(),
        user_id: user._id, // ✅ FIX HERE
        product_id: products.map(p => p._id),
        payment_id: razorpay_payment_id,
        status: "paid"
    });
    console.log("💾 Order created:", user_id);
  await cartModel.findOneAndDelete({ user_id:user._id });
    console.log("🎉 Order Saved Successfully:", order);

    res.json({ success: true, order });
}); 
module.exports = verifyPayment;