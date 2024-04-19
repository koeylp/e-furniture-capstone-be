const express = require("express");
const router = express.Router();
const ReportController = require("../../controllers/reportController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(32));

router.get(
  "/all",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(ReportController.getReports)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(ReportController.getReportsByState)
);

router.put(
  "/:report_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(ReportController.confirmReport)
);

module.exports = router;
