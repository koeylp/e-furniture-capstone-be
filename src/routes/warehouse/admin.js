const express = require("express");
const router = express.Router();
const WareHouseController = require("../../controllers/warehouseController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.delete(
  "/:warehouse_id",
  asyncHandler(WareHouseController.removeWareHouse)
);

module.exports = router;
