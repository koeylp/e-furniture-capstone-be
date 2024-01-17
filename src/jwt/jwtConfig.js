// config/jwt-config.js
const fs = require("fs");
const { generatePrivateKey } = require("../utils/generatePrivateKey");

if (!fs.existsSync("private.key")) {
  generatePrivateKey();
}
const privateKey = fs.readFileSync("private.key", "utf8");
const publicKey = fs.readFileSync("public.key", "utf8");

const accessTokenOptions = {
  expiresIn: "60s",
  algorithm: "RS256",
};

const refreshTokenOptions = {
  expiresIn: "7d",
  algorithm: "RS256",
};

const jwtConfig = Object.freeze({
  SECRET: "SECRET_E_FURNITURE",
  SECRET_REFRESH: "SECRET_REFRESH_E_FURNITURE",
  tokenLife: "60s",
  refreshTokenLife: "7d",
});

module.exports = {
  accessTokenOptions,
  refreshTokenOptions,
  publicKey,
  jwtConfig,
  privateKey,
};
