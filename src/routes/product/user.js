//for user
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/:type", asyncHandler(ProductController.getProductsByType));
router.get("/detail/:slug", asyncHandler(ProductController.findProduct));
router.get(
  "/:type/:slug",
  asyncHandler(ProductController.getProductsBySubType)
);

module.exports = router;
