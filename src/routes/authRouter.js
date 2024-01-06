const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { asyncHandler } = require("../utils/asyncHandler");

router.route("/register").post(asyncHandler(authController.register));
router.route("/login").post(asyncHandler(authController.login));
router.route("/logout").post(asyncHandler(authController.logout));

module.exports = router;
