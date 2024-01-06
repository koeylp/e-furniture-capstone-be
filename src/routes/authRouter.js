const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));

module.exports = router;
