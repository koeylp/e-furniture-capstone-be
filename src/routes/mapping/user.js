const express = require("express");
const router = express.Router();
const MappingController = require("../../controllers/mappingController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/route", asyncHandler(MappingController.getRouteData));

module.exports = router;
