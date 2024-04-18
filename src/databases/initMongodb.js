// config/database.js
const mongoose = require("mongoose");
const _CONF = require("../config");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(_CONF.mongo.uri);
    console.log("Connected to the database with URI: " + _CONF.mongo.uri);
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error}`);
  }
};

module.exports = { connectToDatabase };
