// config/jwt-config.js
const fs = require("fs");

const privateKey = fs.readFileSync("private.key", "utf8");

const verifyOptions = {
  expiresIn: "1h",
  algorithm: "RS256",
};

module.exports = { verifyOptions, privateKey };
