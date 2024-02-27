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

module.exports = router;
