const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { asyncHandler } = require("../utils/asyncHandler");
const { verifyToken } = require("../jwt/verifyToken");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/login/efurniture", asyncHandler(authController.loginEfurniture));
router.post("/login/delivery", asyncHandler(authController.loginDelivery));
router.post("/logout", verifyToken, asyncHandler(authController.logout));
router.post("/refresh", asyncHandler(authController.refreshToken));

module.exports = router;
