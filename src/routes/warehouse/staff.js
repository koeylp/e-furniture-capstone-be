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

router.get(
  "/:product_id",
  hasPermission(global.PermissionConstants.STAFF_GET),
  asyncHandler(WareHouseController.getProductInsideWarehouse)
);
router.post(
  "/",
  hasPermission(global.PermissionConstants.STAFF_POST),
  asyncHandler(WareHouseController.createWareHouse)
);
// router.put(
//   "/:warehouse_id",
//   hasPermission(global.PermissionConstants.STAFF_PUT),
//   asyncHandler(WareHouseController.addProductToWareHouse)
// );
// router.put(
//   "/removeProduct/:warehouse_id",
//   hasPermission(global.PermissionConstants.STAFF_PUT),
//   asyncHandler(WareHouseController.removeProductFromWareHouse)
// );
router.put(
  "/lowStock/update",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateLowStockValue)
);
router.put(
  "/lowstock",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateIsLowStock)
);
router.put(
  "/edit",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateWareHouse)
);
router.put(
  "/stock/update",
  hasPermission(global.PermissionConstants.STAFF_PUT),
  asyncHandler(WareHouseController.updateProductStockInWarehouse)
);

module.exports = router;
