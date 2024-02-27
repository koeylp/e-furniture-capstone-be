const express = require("express");
const router = express.Router();
const RoomController = require("../../controllers/roomController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(RoomController.getPublishRooms));

module.exports = router;
