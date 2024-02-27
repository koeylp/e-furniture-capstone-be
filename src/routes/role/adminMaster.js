const express = require("express");
const router = express.Router();
const RoleController = require("../../controllers/roleController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(131072));

router.post(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_POST),
  asyncHandler(RoleController.create)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_GET),
  asyncHandler(RoleController.getRole)
);
router.get(
  "/:role_id",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_GET),
  asyncHandler(RoleController.findRole)
);
router.put(
  "/:role_id",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_PUT),
  asyncHandler(RoleController.updateRole)
);
router.delete(
  "/:role_id",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_DELETE),
  asyncHandler(RoleController.deleteRole)
);

module.exports = router;
