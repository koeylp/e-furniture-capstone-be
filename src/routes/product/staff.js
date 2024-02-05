//for staff
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(ProductController.createProduct));
router.put("/:product_id", asyncHandler(ProductController.updateProduct));

module.exports = router;
