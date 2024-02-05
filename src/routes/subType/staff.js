const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(SubTypeController.createSubType));

module.exports = router;
