// config/mongoConfig.js
module.exports = {
  uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/capstone-db",
  urlDocker: process.env.MONGO_URL || "mongodb://mongodb/capstone-db",
};
