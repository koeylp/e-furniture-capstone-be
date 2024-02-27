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
  "/",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(WareHouseController.getWareHouses)
);
router.get(
  "/:warehouse_id",
  hasPermission([
    global.PermissionConstants.STAFF_GET,
    global.PermissionConstants.ADMIN_GET,
  ]),
  asyncHandler(WareHouseController.findWareHouseById)
);

module.exports = router;
