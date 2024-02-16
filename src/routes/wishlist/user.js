const express = require("express");
const router = express.Router();
const WishlistController = require("../../controllers/wishlistController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");

router.post("/:product_id", asyncHandler(WishlistController.addToWishlist));

module.exports = router;
