const express = require("express");
const router = express.Router();

router.use("/staff", require("./staff"));
router.use("/", require("./delivery"));
router.use("/share", require("./share"));

module.exports = router;
