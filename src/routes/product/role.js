//for admin
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const {
  verifyRole,
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");
const { asyncHandler } = require("../../utils/asyncHandler");

router.use(verifyToken);
router.use(hasAccess(30));

router.get(
  "/",
  verifyRole,
  hasPermission("[101]"),
  asyncHandler(ProductController.forCheckingRole)
);

module.exports = router;
