const express = require("express");
const router = express.Router();
const WareHouseController = require("../../controllers/warehouseController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.use(verifyToken);
router.use(hasAccess(512));

router.delete(
  "/:warehouse_id",
  hasPermission("[112]"),
  asyncHandler(WareHouseController.removeWareHouse)
);

module.exports = router;
