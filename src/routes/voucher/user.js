const express = require("express");
const router = express.Router();
const VoucherController = require("../../controllers/voucherController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");

router.get("/", asyncHandler(VoucherController.getAllActiveVouchers));
router.post(
  "/apply-voucher/:voucher_id",
  asyncHandler(VoucherController.applyVoucher)
);
router.get(
  "/get-by-specified",
  asyncHandler(VoucherController.getBySpecified)
);

module.exports = router;
