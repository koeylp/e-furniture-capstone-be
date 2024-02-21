const express = require("express");
const router = express.Router();
const OrderController = require("../../controllers/orderController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/create-order", asyncHandler(OrderController.createOrderGuest));

module.exports = router;
