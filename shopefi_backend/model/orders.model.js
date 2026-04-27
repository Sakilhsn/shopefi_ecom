const mongoose = require("mongoose");
const userModel = require("./users.model");
const orderSchema = mongoose.Schema(
  {
    order_id: {
      type: String,
      unique: true,
      required: [true, "order_id has to be provided"],
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    product_id:[ {
      type: mongoose.Types.ObjectId,
      required: [true],
      ref: "productModel",
    }],
    order_date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
module.exports=mongoose.model("orderModel",orderSchema,"orders")
console.log("orderModel is working")