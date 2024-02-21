const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/cartController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/checkout", asyncHandler(CartController.checkout));

module.exports = router;
