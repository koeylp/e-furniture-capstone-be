//for user
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(TypeController.getPublishedType));
router.get("/:type_slug", asyncHandler(TypeController.getSubType));
router.get("/detail/:type", asyncHandler(TypeController.getTypeDetail));

module.exports = router;
