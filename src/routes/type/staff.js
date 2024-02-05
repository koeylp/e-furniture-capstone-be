//for staff
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(TypeController.getAllType));
router.post("/", asyncHandler(TypeController.createType));

module.exports = router;
