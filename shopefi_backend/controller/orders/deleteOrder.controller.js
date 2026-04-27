const asyncHandler = require("express-async-handler");
const orderModel = require("../../model/orders.model");

const deleteOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.oid;

    if (!orderId) {
        return res.status(400).json({ message: "Order ID must be provided" });
    }

    try {
        const deletedOrder = await orderModel.deleteOne({ order_id: orderId }).exec();

        if (deletedOrder.deletedCount === 1) {
            return res.status(200).json({ message: "Order deleted successfully" });
        } else {
            return res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete order", error: error.message });
    }
});

module.exports = deleteOrder;
console.log("deleteOrderController is working");
