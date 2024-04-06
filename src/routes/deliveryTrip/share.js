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

router.get(
  "/detail/:trip_id",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.DELIVERY_GET,
  ]),
  asyncHandler(DeliveryController.findTrip)
);

module.exports = router;
