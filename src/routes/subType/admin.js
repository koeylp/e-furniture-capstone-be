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
router.use(hasAccess(7680));

router.put(
  "/:type_slug/:subType_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(SubTypeController.publishSubType)
);
router.put(
  "/draft/:type_slug/:subType_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(SubTypeController.draftSubType)
);
router.delete(
  "/:type_slug/:subType_slug",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(SubTypeController.removeSubType)
);

module.exports = router;
