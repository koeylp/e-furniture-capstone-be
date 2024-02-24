const express = require("express");
const router = express.Router();
const RoomController = require("../../controllers/roomController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(RoomController.createRoom));
router.put("/:room_id", asyncHandler(RoomController.editRoom));

module.exports = router;
