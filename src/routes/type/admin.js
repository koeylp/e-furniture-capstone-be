//for admin
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(512));

router.put(
  "/:type_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(TypeController.publishType)
);
router.put(
  "/draft/:type_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(TypeController.draftType)
);
router.delete(
  "/:type_slug",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(TypeController.removeType)
);

module.exports = router;
