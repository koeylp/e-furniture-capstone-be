const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { asyncHandler } = require("../utils/asyncHandler");

router.post("/", asyncHandler(productController.createProduct));

module.exports = router;
