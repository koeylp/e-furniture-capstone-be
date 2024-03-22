const express = require("express");
const router = express.Router();
const FeedBackController = require("../../controllers/feedBackController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.post(
  "/",
  verifyToken,
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(FeedBackController.create)
);
router.get(
  "/:product_id",
  asyncHandler(FeedBackController.getFeedBacksByProduct)
);

module.exports = router;
