const express = require("express");
const router = express.Router();
const NotiController = require("../../controllers/notificationEfurnitureController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.get(
  "/",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(NotiController.getNotis)
);

router.get(
  "/admin",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(NotiController.getNotisAdmin)
);

router.get(
  "/staff",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(NotiController.getNotisStaff)
);

module.exports = router;
