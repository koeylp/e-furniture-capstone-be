//for admin
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/draft", asyncHandler(ProductController.getDraftProduct));
router.get("/published", asyncHandler(ProductController.getPublishedProduct));

module.exports = router;
