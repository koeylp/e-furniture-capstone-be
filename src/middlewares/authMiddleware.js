const jwt = require("jsonwebtoken");
const { accessTokenOptions, publicKey } = require("../jwt/jwtConfig");
const { UnAuthorizedError } = require("../utils/errorHanlder");
const { formatToken } = require("../utils/format");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnAuthorizedError("Unauthorized - Missing token");
  }
    const decoded = jwt.verify(token, publicKey, accessTokenOptions);
    req.user = formatToken(decoded);
    next();
  
};

module.exports = authenticateUser;
