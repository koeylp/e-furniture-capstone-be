const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.put(
  "/:type_slug/:subType_slug",
  asyncHandler(SubTypeController.publishSubType)
);
router.put(
  "/draft/:type_slug/:subType_slug",
  asyncHandler(SubTypeController.draftSubType)
);

module.exports = router;
