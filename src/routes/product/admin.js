//for admin
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");
const { hasIn } = require("lodash");

router.use(verifyToken);
router.use(hasAccess(512));

router.put(
  "/draft/:type_slug/:product_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(ProductController.draftProduct)
);
router.put(
  "/publish/:type_slug/:product_slug",
  hasPermission(global.PermissionConstants.ADMIN_PUT),
  asyncHandler(ProductController.publishProduct)
);
router.delete(
  "/:product_slug",
  hasPermission(global.PermissionConstants.ADMIN_DELETE),
  asyncHandler(ProductController.removeProduct)
);
router.get(
  "/draft",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(ProductController.getDraftProduct)
);
router.get(
  "/all",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(ProductController.getAllProducts)
);

router.get(
  "/validFlashSale",
  hasPermission(global.PermissionConstants.ADMIN_GET),
  asyncHandler(ProductController.getProductValidForFlashSale)
);

module.exports = router;
