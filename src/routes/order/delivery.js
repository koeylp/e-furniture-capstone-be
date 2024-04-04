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
router.use(hasAccess(8192));

router.put(
  "/update-tracking/:order_id",
  hasPermission(global.PermissionConstants.DELIVERY_PUT),
  asyncHandler(OrderController.updateTracking)
);

router.get(
  "/all/orders",
  hasPermission(global.PermissionConstants.DELIVERY_GET),
  asyncHandler(OrderController.getOrders)
);

router.get(
  "/:order_id",
  hasPermission(global.PermissionConstants.DELIVERY_GET),
  asyncHandler(OrderController.findOrder)
);

router.get(
  "/",
  hasPermission(global.PermissionConstants.DELIVERY_GET),
  asyncHandler(OrderController.findOrderByType)
);

router.put(
  "/update-tracking/substate/:order_id",
  hasPermission(global.PermissionConstants.DELIVERY_PUT),
  asyncHandler(OrderController.updateSubstateShipping)
);
router.put(
  "/update-tracking/shipping/done/:order_id",
  hasPermission(global.PermissionConstants.DELIVERY_PUT),
  asyncHandler(OrderController.doneShipping)
);

module.exports = router;
