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

router.use(verifyToken);
router.use(hasAccess(512));

router.put(
  "/draft/:type_slug/:product_slug",
  hasPermission("[111]"),
  asyncHandler(ProductController.draftProduct)
);
router.put(
  "/publish/:type_slug/:product_slug",
  hasPermission("[111]"),
  asyncHandler(ProductController.publishProduct)
);
router.delete(
  "/:product_slug",
  hasPermission("[112]"),
  asyncHandler(ProductController.removeProduct)
);
router.get(
  "/draft",
  hasPermission("[109]"),
  asyncHandler(ProductController.getDraftProduct)
);

module.exports = router;
