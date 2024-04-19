const express = require("express");
const router = express.Router();

router.use("/", require("./staff"));

module.exports = router;
