const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/cartController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(2));

router.post(
  "/add-to-cart",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(CartController.addToCart)
);
router.delete(
  "/remove-item",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(CartController.removeItem)
);
router.delete(
  "/remove-all",
  hasPermission(global.PermissionConstants.USER_DELETE),
  asyncHandler(CartController.removeAll)
);
router.get(
  "/",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(CartController.getCart)
);
router.put(
  "/update-quantity",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(CartController.updateItemQuantity)
);
router.put(
  "/item",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(CartController.updateItemInCart)
);
router.put(
  "/increase",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(CartController.increaseItemQuantity)
);
router.put(
  "/decrease",
  hasPermission(global.PermissionConstants.USER_PUT),
  asyncHandler(CartController.decreaseItemQuantity)
);
router.post(
  "/checkout",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(CartController.checkout)
);
router.post(
  "/items/add-all",
  hasPermission(global.PermissionConstants.USER_POST),
  asyncHandler(CartController.addArrayToCart)
);

module.exports = router;
