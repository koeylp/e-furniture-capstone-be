
const { HttpStatusCode } = require("axios");
const jwt = require("jsonwebtoken");

const verifyPrivilege = (req, res, next, expectedPrivilege) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Verify privilege
    if (req.user[expectedPrivilege]) {
      next();
    } else {
      res
        .status(HttpStatusCode.Unauthorized)
        .json({ error: "You are not authorized to perform this operation!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminProtection = (req, res, next) => {
  verifyPrivilege(req, res, next, "admin");
};

const customerProtection = (req, res, next) => {
  verifyPrivilege(req, res, next, "customer");
};

module.exports = { customerProtection, adminProtection };
