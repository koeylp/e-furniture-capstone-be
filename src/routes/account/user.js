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
router.use(hasAccess(2));

router.get(
  "/:account_id",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(AccountController.findAccount)
);
router.put(
  "/:account_id",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(AccountController.editAccount)
);
router.put(
  "/password/:account_id",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(AccountController.editPassword)
);

module.exports = router;
