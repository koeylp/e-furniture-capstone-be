const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin"));
router.use("/role", require("./role"));
router.use("/staff", require("./staff"));
router.use("/", require("./user"));

module.exports = router;
