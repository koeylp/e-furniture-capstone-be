const express = require("express");
const router = express.Router();
const RoleController = require("../../controllers/roleController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(RoleController.create));
router.get("/check", asyncHandler(RoleController.check));
router.get("/", asyncHandler(RoleController.getRole));

module.exports = router;
