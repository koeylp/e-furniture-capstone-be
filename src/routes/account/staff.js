//for admin
const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/accountController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.get(
  "/delivery",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(AccountController.getDeliveryAccount)
);

module.exports = router;
