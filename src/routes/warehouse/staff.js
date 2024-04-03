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
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.addProductToWareHouse)
);
router.put(
  "/lowstock/:warehouse_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateIsLowStock)
);
router.put(
  "/:warehouse_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateWareHouse)
);
router.put(
  "/stock/update/:warehouse_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateProductStockInWarehouse)
);
router.put(
  "/lowStock/update/:warehouse_id",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateLowStockValue)
);

module.exports = router;
