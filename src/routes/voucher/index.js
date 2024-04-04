const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/staff", require("./staff"));
router.use("/admin", require("./admin"));

module.exports = router;
