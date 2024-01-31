const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/cartController");
const { asyncHandler } = require("../../utils/asyncHandler");
const { verifyToken } = require("../../jwt/verifyToken");

router.post("/add-to-cart", asyncHandler(CartController.addToCart));
router.delete("/remove-item", asyncHandler(CartController.removeItem));
router.delete("/remove-all", asyncHandler(CartController.removeAll));
router.get("/", asyncHandler(CartController.getCart));
router.put("/update-quantity", asyncHandler(CartController.updateItemQuantity));
router.put("/increase", asyncHandler(CartController.increaseItemQuantity));
router.put("/decrease", asyncHandler(CartController.decreaseItemQuantity));


module.exports = router;
