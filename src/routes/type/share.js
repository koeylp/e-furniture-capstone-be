//for staff
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
router.use(hasAccess(32));

router.get(
  "/draft",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(TypeController.getDraftType)
);
router.get(
  "/",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(TypeController.getAllType)
);
router.get(
  "/:type_slug",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(TypeController.getSubTypeByTypeStaff)
);

module.exports = router;
