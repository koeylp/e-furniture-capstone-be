// config/database.js
const mongoose = require("mongoose");
const _CONF = require("../config");
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

const connectToDatabase = async () => {
  try {
    // const connectionUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.zpdt7.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_CLUSTER}`;
    await mongoose.connect(_CONF.mongo.uri);
    console.log("Connected to the database with URI: " + _CONF.mongo.uri);
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error}`);
  }
};

module.exports = { connectToDatabase };
