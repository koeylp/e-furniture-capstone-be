const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/guest", require("./guest"));

module.exports = router;
