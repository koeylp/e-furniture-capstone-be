const express = require("express");
const router = express.Router();
const AttributeController = require("../../controllers/attributeController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasAccess,
  hasPermission,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.post(
  "/",
  hasPermission("106"),
  asyncHandler(AttributeController.createAttribute)
);
router.get(
  "/",
  hasPermission("105"),
  asyncHandler(AttributeController.getAllAttribute)
);
router.get(
  "/:attribute_id",
  hasPermission("105"),
  asyncHandler(AttributeController.findAttribute)
);

module.exports = router;
