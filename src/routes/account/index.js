const express = require("express");
const router = express.Router();

router.use("/adminMaster", require("./adminMaster"));
router.use("/", require("./user"));

module.exports = router;
