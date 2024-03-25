const express = require("express");
const router = express.Router();
const VoucherController = require("../../controllers/voucherController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(2));

router.post(
  "/apply-voucher/:voucher_id",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(VoucherController.applyVoucher)
);
router.post(
  "/get-by-specified",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(VoucherController.getBySpecified)
);

module.exports = router;
