const express = require("express");
const router = express.Router();
const WareHouseController = require("../../controllers/warehouseController");
const { asyncHandler } = require("../../utils/asyncHandler");

router.post("/", asyncHandler(WareHouseController.createWareHouse));
router.put("/:warehouse_id", asyncHandler(WareHouseController.updateWareHouse));

module.exports = router;
