//for admin
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.put("/:type_slug", asyncHandler(TypeController.publishType));
router.put("/draft/:type_slug", asyncHandler(TypeController.draftType));

module.exports = router;
