const express = require("express");
const router = express.Router();

router.use("/adminMaster", require("./adminMaster"));

module.exports = router;
