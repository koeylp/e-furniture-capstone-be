const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { asyncHandler } = require("../utils/asyncHandler");
const { verifyToken } = require("../jwt/verifyToken");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", verifyToken, asyncHandler(authController.logout));
router.post("/refresh", asyncHandler(authController.refreshToken));

module.exports = router;
