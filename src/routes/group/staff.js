const express = require("express");
const router = express.Router();
const SubTypeGroupController = require("../../controllers/subTypeGroupController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(480));

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(SubTypeGroupController.create)
);

module.exports = router;
