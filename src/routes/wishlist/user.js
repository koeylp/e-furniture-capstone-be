const express = require("express");
const router = express.Router();
const WishlistController = require("../../controllers/wishlistController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");
const { hasAccess } = require("../../middlewares/rolePermission");

router.use(verifyToken);
router.use(hasAccess(2));

router.post("/:product_id", asyncHandler(WishlistController.addToWishlist));
router.get("/", asyncHandler(WishlistController.getWishlistByAccount));
router.delete("/:product_id", asyncHandler(WishlistController.removeProduct));

module.exports = router;
