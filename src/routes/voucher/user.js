const express = require("express");
const router = express.Router();
const VoucherController = require("../../controllers/voucherController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");

router.get("/", asyncHandler(VoucherController.getAllActiveVouchers));
router.post("/apply-voucher", asyncHandler(VoucherController.applyVoucher));

module.exports = router;
