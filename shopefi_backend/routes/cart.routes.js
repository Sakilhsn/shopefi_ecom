const express = require("express");
const router = express.Router();

const addToCart = require("../controller/cart/addToCart.controller");
const getCart = require("../controller/cart/getCart.controller");
const removeFromCart = require("../controller/cart/removeFromCart.controller");
const updateCartQuantity = require("../controller/cart/updateCartQuantity.controller");

router.post("/add/:uid", addToCart);
router.get("/:uid", getCart);
router.delete("/remove/:uid", removeFromCart);
router.put("/update/:uid", updateCartQuantity);

module.exports = router;