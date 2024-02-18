const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(32));

router.put(
  "/:type_slug/:subType_slug",
  hasPermission("[111]"),
  asyncHandler(SubTypeController.publishSubType)
);
router.put(
  "/draft/:type_slug/:subType_slug",
  hasPermission("[111]"),
  asyncHandler(SubTypeController.draftSubType)
);

module.exports = router;
