const express = require("express");
const router = express.Router();
// const authenticateUser = require("../middlewares/authMiddleware");

// testing of a protected route that requires authentication
router.get("/protected", (req, res) => {
  res.json({
    message: "You have access to this protected route!",
    user: req.user,
  });
});

module.exports = router;
