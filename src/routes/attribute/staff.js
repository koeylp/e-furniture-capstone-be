const express = require("express");
const router = express.Router();
const AttributeController = require("../../controllers/attributeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(AttributeController.createAttribute));
router.get("/", asyncHandler(AttributeController.getAllAttribute));
router.get("/:attribute_id", asyncHandler(AttributeController.findAttribute));

module.exports = router;
