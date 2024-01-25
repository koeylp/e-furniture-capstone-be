const express = require("express");
const router = express.Router();
const TypeController = require("../controllers/typeController");
const { asyncHandler } = require("../utils/asyncHandler");

router.post("/", asyncHandler(TypeController.createType));
router.put("/:type_id", asyncHandler(TypeController.addSubType));

module.exports = router;
