// config/database.js
const mongoose = require("mongoose");
const _CONF = require("../config");
// const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;

const connectToDatabase = async () => {
  try {
    // mongo atlas option
    // const connectionUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(_CONF.mongo.uri);
    console.log("Connected to the database with URI: " + _CONF.mongo.uri);
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error}`);
  }
};

module.exports = { connectToDatabase };
