const redis = require("redis");
// const _CONF = require("../config");
const redisConfig = require("../config/redisConfig");

const REDIS_URL = redisConfig.uri;

const client = redis.createClient({
  url: REDIS_URL,
  legacyMode: true,
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

client.connect();

client.ping((err) => {
  if (!err) {
    console.log("Connected to Redis with URI: " + REDIS_URL);
  } else {
    console.error("Error pinging Redis:", err);
  }
});

module.exports = client;
