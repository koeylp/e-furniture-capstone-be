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
  hasPermission(["[105]", "[109]"]),
  asyncHandler(RoomController.getDraftRooms)
);
router.get(
  "/",
  hasPermission(["[105]", "[109]"]),
  asyncHandler(RoomController.getRooms)
);

module.exports = router;
