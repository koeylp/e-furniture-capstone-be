const express = require("express");
const router = express.Router();
const SubTypeController = require("../../controllers/subTypeController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get(
  "/:type_slug/:slug",
  asyncHandler(SubTypeController.getSubTypeDetail)
);

module.exports = router;
