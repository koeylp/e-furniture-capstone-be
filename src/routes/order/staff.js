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
router.use(hasAccess(32));

router.get(
  "/",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(OrderController.findOrderByType)
);

router.put(
  "/order-tracking/processing/:order_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(OrderController.processingToShiping)
);

module.exports = router;
