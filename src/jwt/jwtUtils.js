const jwt = require("jsonwebtoken");
const { verifyOptions, privateKey } = require("../../config/jwt-config");

const generateToken = (user) => {

  const payload = {
    userId: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, privateKey, verifyOptions);
  return token;
};

module.exports = { generateToken };