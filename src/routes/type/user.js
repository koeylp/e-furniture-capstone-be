//for user
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(TypeController.getPublishedType));
router.get("/:type_id", asyncHandler(TypeController.getSubType));

module.exports = router;
