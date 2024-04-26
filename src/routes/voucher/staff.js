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
router.use(hasAccess(32));

router.post(
  "/create-voucher",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(VoucherController.createVoucher)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(VoucherController.getAllVouchers)
);
router.put(
  "/:voucher_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(VoucherController.editVoucher)
);
router.delete(
  "/:voucher_id",
  hasPermission(global.PermissionConstants.STAFF_DELETE),
  asyncHandler(VoucherController.removeVoucher)
);

module.exports = router;
