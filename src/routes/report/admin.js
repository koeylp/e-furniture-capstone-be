const express = require("express");
const router = express.Router();
const ReportController = require("../../controllers/reportController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(ReportController.getReports));

module.exports = router;
