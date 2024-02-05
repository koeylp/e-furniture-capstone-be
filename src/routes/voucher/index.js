const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/staff", require("./staff"));

module.exports = router;
