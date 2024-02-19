//for admin
const express = require("express");
const router = express.Router();
const TypeController = require("../../controllers/typeController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(512));

router.put(
  "/:type_slug",
  hasPermission("[111]"),
  asyncHandler(TypeController.publishType)
);
router.put(
  "/draft/:type_slug",
  hasPermission("[111]"),
  asyncHandler(TypeController.draftType)
);

module.exports = router;
