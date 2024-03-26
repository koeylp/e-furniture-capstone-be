const express = require("express");
const router = express.Router();
const DeliveryController = require("../../controllers/deliveryTripController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(DeliveryController.createTrip));
router.get("/:trip_id", asyncHandler(DeliveryController.findTrip));
router.put("/:trip_id", asyncHandler(DeliveryController.updateTripDoneStatus));

module.exports = router;
