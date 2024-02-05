//for admin
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.put(
  "/draft/:type_slug/:product_slug",
  asyncHandler(ProductController.draftProduct)
);
router.put(
  "/publish/:type_slug/:product_slug",
  asyncHandler(ProductController.publishProduct)
);
router.delete("/:product_slug", asyncHandler(ProductController.removeProduct));
router.get("/draft", asyncHandler(ProductController.getDraftProduct));

module.exports = router;
