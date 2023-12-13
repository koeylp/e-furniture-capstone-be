// config/index.js
require("dotenv").config();

const databaseConfig = require("./database");
const serverConfig = require("./server");

module.exports = {
  database: databaseConfig,
  server: serverConfig,
};
