// config/database.js
const mongoose = require("mongoose");
const { MONGO_URL } = process.env;
// const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;

const connectToDatabase = async () => {
  try {
    // mongo atlas option
    // const connectionUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(MONGO_URL);
    console.log("Connected to the database with URI: " + MONGO_URL);
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error}`);
  }
};

module.exports = { connectToDatabase };
