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
router.use(hasAccess(32));

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(DeliveryController.createTrip)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(DeliveryController.getAllTrip)
);
router.get(
  "/pending",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(DeliveryController.getTripPending)
);
router.put(
  "/confirm/:trip_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(DeliveryController.confirmDeliveryTrip)
);
router.put(
  "/reject/:trip_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(DeliveryController.rejectDeliveryTrip)
);

module.exports = router;
