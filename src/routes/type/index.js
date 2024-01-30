const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/admin", require("./admin"));
router.use("/staff", require("./staff"));

module.exports = router;
