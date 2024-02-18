// src/jwt/jwtUtils.js
const JWT = require("jsonwebtoken");
const logger = require("../utils/logger");

const generateToken = async ({ payload, privateKey }) => {
  const access_token = await JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "30m",
  });
  const refresh_token = await JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "60d",
  });
  return { access_token, refresh_token };
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
  generateToken,
  markRefreshTokensAsUsed,
};
