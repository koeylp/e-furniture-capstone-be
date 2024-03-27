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
router.use(hasAccess(8190));

router.get(
  "/",
  hasPermission(global.PermissionConstants.DELIVERY_GET),
  asyncHandler(AccountController.checkAccountStatus)
);

module.exports = router;
