const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../utils/asyncHandler");
const FlashSaleController = require("../../controllers/flashSaleController");

router.get("/today", asyncHandler(FlashSaleController.getFlashSalesToday));
router.get("/future", asyncHandler(FlashSaleController.getFlashSaleFutute));
router.get("/check/:flashSale_id", asyncHandler(FlashSaleController.checkTime));

module.exports = router;
