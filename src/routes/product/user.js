//for user
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/:type_slug", asyncHandler(ProductController.getProductsByType));
router.get("/search/:text", asyncHandler(ProductController.searchProduct));
router.get("/detail/:slug", asyncHandler(ProductController.findProduct));
router.get(
  "/:type_slug/:slug",
  asyncHandler(ProductController.getProductsBySubType)
);
router.get("/", asyncHandler(ProductController.getPublishedProduct));
router.get("/top/u/best-seller", asyncHandler(ProductController.getBestSeller));

module.exports = router;
