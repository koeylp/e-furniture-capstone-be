const express = require("express");
const router = express.Router();
const WareHouseController = require("../../controllers/warehouseController");
const { asyncHandler } = require("../../utils/asyncHandler");
const {
  hasPermission,
  hasAccess,
} = require("../../middlewares/rolePermission");
const { verifyToken } = require("../../jwt/verifyToken");

router.get("/detail", asyncHandler(WareHouseController.findWareHouse));
router.get(
  "/:warehouse_id",
  asyncHandler(WareHouseController.findWareHouseById)
);

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

module.exports = router;
