const express = require("express");
const router = express.Router();

router.use("/shared", require("./shared"));

module.exports = router;
