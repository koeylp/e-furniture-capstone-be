const express = require("express");
const router = express.Router();
const NotiController = require("../../controllers/notificationController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get(
  "/:account_id",
  asyncHandler(NotiController.getNotificationsByAccount)
);

module.exports = router;
