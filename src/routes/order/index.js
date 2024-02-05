const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin"));
router.use("/staff", require("./staff"));
router.use("/delivery", require("./delivery"));
router.use("/", require("./user"));

module.exports = router;
