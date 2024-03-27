const express = require("express");
const router = express.Router();

router.use("/", require("./delivery"));

module.exports = router;
