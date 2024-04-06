//for staff
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.get(
  "/draft",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(ProductController.getDraftProduct)
);
router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(ProductController.createProduct)
);
router.put(
  "/:product_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(ProductController.updateProduct)
);

module.exports = router;
