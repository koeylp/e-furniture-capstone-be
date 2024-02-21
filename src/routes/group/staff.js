const express = require("express");
const router = express.Router();
const SubTypeGroupController = require("../../controllers/subTypeGroupController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(SubTypeGroupController.create));

module.exports = router;
