const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");
const RevenueController = require("../../controllers/revenueController");

router.use(verifyToken);
router.use(hasAccess(512));

router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(RevenueController.getRevenueToday)
);
router.post(
  "/byRange",
  hasPermission(global.PermissionConstants.ADMIN_POST),
  asyncHandler(RevenueController.getRevenueByRange)
);
router.post(
  "/byDay",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(RevenueController.getRevenueByDay)
);

module.exports = router;
