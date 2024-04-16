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

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(TypeController.createType)
);
router.put(
  "/:type_slug",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(TypeController.publishType)
);
router.put(
  "/draft/:type_slug",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(TypeController.draftType)
);

module.exports = router;
