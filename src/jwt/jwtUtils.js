const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
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

const markRefreshTokensAsUsed = async (userId) => {
  try {
    await RefreshToken.updateMany(
      { user: userId },
      { $push: { refreshTokenUsed: new Date() } }
    );
  } catch (error) {
    logger(error.message);
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  markRefreshTokensAsUsed,
};
