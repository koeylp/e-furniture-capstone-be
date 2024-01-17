// config/index.js
require("dotenv").config();

const routeConfig = require("./routeConfig");
const mongoConfig = require("./mongoConfig");
const redisConfig = require("./redisConfig");

module.exports = {
  routes: routeConfig,
  mongo: mongoConfig,
  _redis: redisConfig,
};
