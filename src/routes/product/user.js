//for user
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/room/:room_id", asyncHandler(ProductController.getProductsByRoom));
router.get("/:type_slug", asyncHandler(ProductController.getProductsByType));
router.get("/detail/:slug", asyncHandler(ProductController.findProduct));
router.get(
  "/:type_slug/:slug",
  asyncHandler(ProductController.getProductsBySubType)
);
router.get("/", asyncHandler(ProductController.getPublishedProduct));

module.exports = router;
