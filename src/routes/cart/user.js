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
  hasPermission("[102]"),
  asyncHandler(CartController.addToCart)
);
router.delete(
  "/remove-item",
  hasPermission("[104]"),
  asyncHandler(CartController.removeItem)
);
router.delete(
  "/remove-all",
  hasPermission("[104]"),
  asyncHandler(CartController.removeAll)
);
router.get("/", hasPermission("[101]"), asyncHandler(CartController.getCart));
router.put(
  "/update-quantity",
  hasPermission("[103]"),
  asyncHandler(CartController.updateItemQuantity)
);
router.put(
  "/increase",
  hasPermission("[103]"),
  asyncHandler(CartController.increaseItemQuantity)
);
router.put(
  "/decrease",
  hasPermission("[103]"),
  asyncHandler(CartController.decreaseItemQuantity)
);
router.post(
  "/checkout",
  hasPermission("[103]"),
  asyncHandler(CartController.checkout)
);

module.exports = router;
