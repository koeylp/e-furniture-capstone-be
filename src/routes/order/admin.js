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
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(OrderController.findOrderByType)
);

router.get(
  "/:order_id",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(OrderController.findOrder)
);

router.get(
  "/all/orders",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(OrderController.getOrders)
);

router.put(
  "/:order_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(OrderController.acceptCancel)
);

router.get(
  "/cancel/requests",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(OrderController.getCancelRequests)
);

router.get(
  "/statistics/7days",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(OrderController.getOrdersIn7daysAgo)
);

module.exports = router;
