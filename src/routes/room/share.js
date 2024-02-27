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

router.get(
  "/draft",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(RoomController.getDraftRooms)
);
router.get(
  "/",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(RoomController.getRooms)
);

module.exports = router;
