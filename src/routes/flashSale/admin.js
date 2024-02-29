const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../utils/asyncHandler");
const FlashSaleController = require("../../controllers/flashSaleController");
const { verifyToken } = require("../../jwt/verifyToken");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(512));

router.post(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_POST),
  asyncHandler(FlashSaleController.create)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(FlashSaleController.getFlashSales)
);
router.get(
  "/:flashSale_id",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(FlashSaleController.findFlashSale)
);
router.put(
  "/:flashSale_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(FlashSaleController.updateFlashSale)
);
router.put(
  "/publish/:flashSale_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(FlashSaleController.publishFlashSale)
);
router.put(
  "/draft/:flashSale_id",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(FlashSaleController.draftFlashSale)
);
router.delete(
  "/:flashSale_id",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(FlashSaleController.removeFlashSale)
);

module.exports = router;
