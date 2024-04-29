const redis = require("redis");
const { RedisErrorResponse } = require("../utils/errorHanlder");
const redisConfig = require("../config/redisConfig");

const REDIS_URL = redisConfig.uri;

let client = {},
  statusConnecRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  };

// const REDIS_CONNECT_TIMEOUT = 10000;
// const REDIS_CONNECT_MESSAGE = {
//   CODE: -99,
//   MESSAGE: {
//     vn: "Redis Kết Nối Lỗi!",
//     en: "Service connection Redis error!",
//   },
// };
// const handleTimeoutError = () => {
//   connectionTimeOut = setTimeout(() => {
//     throw new RedisErrorResponse({
//       message: REDIS_CONNECT_MESSAGE.MESSAGE,
//       statusCode: REDIS_CONNECT_MESSAGE.CODE,
//     });
//   }, REDIS_CONNECT_TIMEOUT);
// };
const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnecRedis.CONNECT, () => {
    console.log(`ConnectionRedis - Connection status: Connected`);
    // clearTimeout(connectionTimeOut);
  });
  connectionRedis.on(statusConnecRedis.END, () => {
    console.log(`ConnectionRedis - Connection status: Disconnected`);
    // handleTimeoutError();
  });
  connectionRedis.on(statusConnecRedis.RECONNECT, () => {
    console.log(`ConnectionRedis - Connection status: Reconnecting`);
    // clearTimeout(connectionTimeOut);
  });
  connectionRedis.on(statusConnecRedis.ERROR, (err) => {
    console.log(`ConnectionRedis - Connection status: Error ${err}`);
    // handleTimeoutError();
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient({
    url: REDIS_URL,
    legacyMode: true,
  });
  client.instanceConnect = instanceRedis;
  handleEventConnect({
    connectionRedis: instanceRedis,
  });
};

const getRedis = () => client;

const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
