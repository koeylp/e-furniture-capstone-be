const express = require("express");
const router = express.Router();
const DeliveryController = require("../../controllers/deliveryTripController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(8190));

router.post(
  "/",
  hasPermission(global.PermissionConstants.DELIVERY_POST),
  asyncHandler(DeliveryController.createTrip)
);
router.get(
  "/:trip_id",
  hasPermission(global.PermissionConstants.DELIVERY_GET),
  asyncHandler(DeliveryController.findTrip)
);
router.put(
  "/:trip_id",
  hasPermission(global.PermissionConstants.DELIVERY_PUT),
  asyncHandler(DeliveryController.updateOrderInTripStatus)
);
router.put(
  "/done/:trip_id",
  hasPermission(global.PermissionConstants.DELIVERY_PUT),
  asyncHandler(DeliveryController.updateTripStatus)
);

module.exports = router;
