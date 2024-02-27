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

router.get(
  "/draft",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(SubTypeController.getDraftSubType)
);
router.get(
  "/",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(SubTypeController.getAllSubType)
);

module.exports = router;
