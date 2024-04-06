const express = require("express");
const router = express.Router();

router.use("/staff", require("./staff"));
router.use("/share", require("./share"));
router.use("/", require("./delivery"));

module.exports = router;
