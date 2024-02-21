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
router.use(hasAccess(2));

router.post(
  "/create-order",
  hasPermission("[102]"),
  asyncHandler(OrderController.createOrder)
);

router.get(
  "/",
  hasPermission("[101]"),
  asyncHandler(OrderController.findOrderByUser)
);

router.get(
  "/:order_id",
  hasPermission("[101]"),
  asyncHandler(OrderController.findOrder)
);

module.exports = router;
