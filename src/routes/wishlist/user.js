const express = require("express");
const router = express.Router();
const WishlistController = require("../../controllers/wishlistController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(2));

router.post(
  "/:product_id",
  hasPermission("[102]"),
  asyncHandler(WishlistController.addToWishlist)
);
router.get(
  "/",
  hasPermission("[101]"),
  asyncHandler(WishlistController.getWishlistByAccount)
);
router.delete(
  "/:product_id",
  hasPermission("[104]"),
  asyncHandler(WishlistController.removeProduct)
);
router.post(
  "/items/add-all",
  hasPermission("[102]"),
  asyncHandler(WishlistController.addArrayToWishlist)
);

module.exports = router;
