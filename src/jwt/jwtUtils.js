const jwt = require("jsonwebtoken");
const {
  accessTokenOptions,
  refreshTokenOptions,
  privateKey,
} = require("../../config/jwt-config");

const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
  };

  const accessToken = jwt.sign(payload, privateKey, accessTokenOptions);
  return accessToken;
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
  };

  const refreshToken = jwt.sign(payload, privateKey, refreshTokenOptions);
  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
