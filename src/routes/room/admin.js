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
router.use(hasAccess(512));

router.delete(
  "/:room_id",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(RoomController.disableRoom)
);
router.put(
  "/:room_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(RoomController.enableRoom)
);

module.exports = router;
