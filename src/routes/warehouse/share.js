const express = require("express");
const router = express.Router();
const WareHouseController = require("../../controllers/warehouseController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.get("/", asyncHandler(WareHouseController.getWareHouses));
router.get(
  "/:warehouse_id",
  asyncHandler(WareHouseController.findWareHouseById)
);

module.exports = router;
