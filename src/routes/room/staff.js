const express = require("express");
const router = express.Router();
const RoomController = require("../../controllers/roomController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(RoomController.createRoom)
);
router.put(
  "/:room_slug",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(RoomController.editRoom)
);
router.put(
  "/draft/:room_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(RoomController.disableRoom)
);
router.put(
  "/publish/:room_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(RoomController.enableRoom)
);
router.delete(
  "/:room_slug",
  hasPermission(global.PermissionConstants.STAFF_DELETE),
  asyncHandler(RoomController.removeRoom)
);

module.exports = router;
