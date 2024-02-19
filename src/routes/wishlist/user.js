const express = require("express");
const router = express.Router();
const WishlistController = require("../../controllers/wishlistController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");

router.post("/:product_id", asyncHandler(WishlistController.addToWishlist));
router.get("/", asyncHandler(WishlistController.getWishlistByAccount));
router.delete("/:product_id", asyncHandler(WishlistController.removeProduct))

module.exports = router;
