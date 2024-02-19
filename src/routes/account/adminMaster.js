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
  "/",
  hasPermission("[117]"),
  asyncHandler(AccountController.getAccounts)
);
router.post(
  "/",
  hasPermission("[118]"),
  asyncHandler(AccountController.createAccount)
);
router.put(
  "/role/:account_id",
  hasPermission("[119]"),
  asyncHandler(AccountController.editRole)
);
router.delete(
  "/enable/:account_id",
  hasPermission("[120]"),
  asyncHandler(AccountController.enableAccount)
);
router.delete(
  "/disable/:account_id",
  hasPermission("[120]"),
  asyncHandler(AccountController.disableAccount)
);

module.exports = router;
