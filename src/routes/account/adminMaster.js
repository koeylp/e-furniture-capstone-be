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
router.use(hasAccess(131072));

router.get(
  "/user",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_GET),
  asyncHandler(AccountController.getAccounts)
);
router.get(
  "/system",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_GET),
  asyncHandler(AccountController.getSystemAccounts)
);
router.post(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_POST),
  asyncHandler(AccountController.createAccount)
);
router.put(
  "/role/:account_id",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_PUT),
  asyncHandler(AccountController.editRole)
);
router.delete(
  "/enable/",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_DELETE),
  asyncHandler(AccountController.enableAccount)
);
router.delete(
  "/disable/",
  hasPermission(global.PermissionConstants.ADMIN_MASTER_DELETE),
  asyncHandler(AccountController.disableAccount)
);

module.exports = router;
