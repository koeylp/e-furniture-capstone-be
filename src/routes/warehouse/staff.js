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
router.use(hasAccess(32));

router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(WareHouseController.createWareHouse)
);
router.put(
  "/:warehouse_id",
  asyncHandler,
  hasPermission(global.PermissionConstants.STAFF_PUT),
  WareHouseController.updateWareHouse
);

module.exports = router;
