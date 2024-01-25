const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController");
const { asyncHandler } = require("../utils/asyncHandler");
const { verifyToken } = require("../jwt/verifyToken");
router.post("/", verifyToken, asyncHandler(AddressController.createAddress));
router.get("/:account_id", asyncHandler(AddressController.getAddressByUser));
router.get("/aaa/:account_id", asyncHandler(AddressController.createAddress));

module.exports = router;
