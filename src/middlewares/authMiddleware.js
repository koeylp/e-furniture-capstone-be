const jwt = require("jsonwebtoken");
const { accessTokenOptions, publicKey } = require("../jwt/jwtConfig");
const { UnAuthorizedError } = require("../utils/errorHanlder");
const { formatToken } = require("../utils/format");
const client = require("../databases/initRedis");

const authenticateUser = (req, res, next) => {
  client.get("token", (err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    const token = result;

    if (!token) {
      return res.status(401).send("Unauthorized - Missing token");
    }

    try {
      const decoded = jwt.verify(token, publicKey, accessTokenOptions);
      req.user = formatToken(decoded);
      next();
    } catch (jwtError) {
      // Handle the JWT verification error
      return res.status(401).send(jwtError);
    }
  });
};


module.exports = authenticateUser;
