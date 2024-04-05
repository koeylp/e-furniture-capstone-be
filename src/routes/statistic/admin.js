const express = require("express");
const router = express.Router();
const StatisticController = require("../../controllers/statisticController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(510));

router.get(
  "/7days",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(StatisticController.getOrdersIn7daysAgo)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(StatisticController.getStatistic)
);

module.exports = router;
