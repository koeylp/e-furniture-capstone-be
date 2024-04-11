const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin"));
router.use("/", require("./user"));

module.exports = router;
