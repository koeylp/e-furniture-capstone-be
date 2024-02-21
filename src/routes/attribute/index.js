const express = require("express");
const router = express.Router();

router.use("/staff", require("./staff"));

module.exports = router;
