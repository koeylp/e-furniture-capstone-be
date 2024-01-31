const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/:type/:slug", asyncHandler(SubTypeController.getSubTypeDetail));

module.exports = router;
