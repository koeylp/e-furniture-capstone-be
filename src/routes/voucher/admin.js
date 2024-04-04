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
router.use(hasAccess(512));

router.delete(
  "/:voucher_id",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(VoucherController.removeVoucher)
);

module.exports = router;
