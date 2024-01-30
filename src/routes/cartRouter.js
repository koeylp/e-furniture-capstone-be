const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const { asyncHandler } = require("../utils/asyncHandler");
const { verifyToken } = require("../jwt/verifyToken");


router.post("/add-to-cart", verifyToken, asyncHandler(CartController.addToCart));
router.post("/remove-item", verifyToken, asyncHandler(CartController.removeItem));

module.exports = router;
