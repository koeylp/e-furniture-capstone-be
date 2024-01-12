const redis = require("redis");
const _CONF = require("../config");

const redisClient = redis.createClient(_CONF.redis.redisConfig.url);

redisClient.on("error", (error) => {
  console.error("Error connecting to Redis:", error);
  process.exit(1);
});

redisClient.ping((err, result) => {
  if (!err) {
    console.log("Connected to Redis with URI: " + _CONF.redis.redisConfig.url);
  } else {
    console.error("Error pinging Redis:", err);
  }
});

module.exports = redisClient;
