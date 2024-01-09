const jwt = require("jsonwebtoken");
const { accessTokenOptions, publicKey } = require("../../config/jwt-config");
const { UnAuthorizedError } = require("../utils/errorHanlder");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnAuthorizedError("Unauthorized - Missing token");
  }

  try {
    const decoded = jwt.verify(token, publicKey, accessTokenOptions);
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnAuthorizedError("Invalid token");
  }
};

module.exports = authenticateUser;
