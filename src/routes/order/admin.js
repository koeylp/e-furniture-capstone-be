const express = require("express");
const router = express.Router();
const OrderController = require("../../controllers/orderController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(512));

router.get(
  "/",
  hasPermission("[109]"),
  asyncHandler(OrderController.findOrderByType)
);

router.get(
  "/:order_id",
  hasPermission("[109]"),
  asyncHandler(OrderController.findOrder)
);

router.get(
  "/all/orders",
  hasPermission("[109]"),
  asyncHandler(OrderController.getOrders)
);

module.exports = router;
