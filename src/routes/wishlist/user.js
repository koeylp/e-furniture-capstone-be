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
  "/",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(WishlistController.addToWishlist)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.USER_GET),
  asyncHandler(WishlistController.getWishlistByAccount)
);
router.delete(
  "/:product_id",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(WishlistController.removeProduct)
);
router.post(
  "/items/add-all",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(WishlistController.addArrayToWishlist)
);

module.exports = router;
