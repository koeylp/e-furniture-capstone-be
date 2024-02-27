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
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(OrderController.createOrder)
);

router.get(
  "/",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(OrderController.findOrderByUser)
);

router.get(
  "/:order_id",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(OrderController.findOrder)
);

module.exports = router;
