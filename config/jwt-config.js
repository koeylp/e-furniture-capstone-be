// config/jwt-config.js
const fs = require("fs");

const privateKey = fs.readFileSync("private.key", "utf8");
const publicKey = fs.readFileSync("public.key", "utf8");

const accessTokenOptions = {
  expiresIn: "1h",
  algorithm: "RS256",
};

const refreshTokenOptions = {
  expiresIn: "7d",
  algorithm: "RS256",
};

module.exports = { accessTokenOptions, refreshTokenOptions, privateKey, publicKey };
