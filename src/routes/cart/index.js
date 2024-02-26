const express = require("express");
const router = express.Router();

router.use("/guest", require("./guest"));
router.use("/", require("./user"));

module.exports = router;
