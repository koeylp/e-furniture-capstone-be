const express = require("express");
const router = express.Router();

router.use("/adminMaster", require("./adminMaster"));
router.use("/delivery", require("./delivery"));
router.use("/staff", require("./staff"));
router.use("/", require("./user"));

module.exports = router;
