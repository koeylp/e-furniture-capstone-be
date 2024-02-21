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
  hasPermission("[115]"),
  asyncHandler(OrderController.updateTracking)
);

router.get(
  "/all/orders",
  hasPermission("[113]"),
  asyncHandler(OrderController.getOrders)
);

router.get(
  "/:order_id",
  hasPermission("[113]"),
  asyncHandler(OrderController.findOrder)
);

router.get(
  "/",
  hasPermission("[113]"),
  asyncHandler(OrderController.findOrderByType)
);


module.exports = router;
