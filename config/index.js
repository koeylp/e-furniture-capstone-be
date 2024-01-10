// config/index.js
require("dotenv").config();

const databaseConfig = require("./database");
const serverConfig = require("./server");
const routeConfig = require("./routeConfig");

module.exports = {
  database: databaseConfig,
  server: serverConfig,
  routes: routeConfig,
};
