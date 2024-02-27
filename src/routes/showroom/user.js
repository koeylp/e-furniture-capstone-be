const express = require("express");
const router = express.Router();
const ShowroomController = require("../../controllers/showroomController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(ShowroomController.createShowroom));
router.get("/", asyncHandler(ShowroomController.getAllShowrooms));
router.get("/:showroom_id", asyncHandler(ShowroomController.getShowroomById));

module.exports = router;
