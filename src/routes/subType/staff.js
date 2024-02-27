const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(SubTypeController.createSubType)
);
router.post(
  "/attribute",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(SubTypeController.getAttributeBySubTypes)
);

module.exports = router;
