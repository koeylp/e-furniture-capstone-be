const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

class RedisService {
  constructor(redisClient) {
    this.redisClient = redisClient;
    this.redisGetAsync = promisify(redisClient.get).bind(redisClient);
    this.redisKeysAsync = promisify(redisClient.keys).bind(redisClient);
    this.redisDelAsync = promisify(redisClient.del).bind(redisClient);
    this.redisSetAsync = promisify(redisClient.set).bind(redisClient);
  }

  static async getCacheRespone(cacheKey) {
    const cacheRespone = await this.redisGetAsync(cacheKey);
    return cacheRespone || null;
  }

  static async removeCacheRespone(pattern) {
    if (!pattern.trim()) {
      throw new Error("Pattern cannot be empty");
    }

    const keys = await this.redisKeysAsync(pattern + "*");
    for (const key of keys) {
      await this.redisDelAsync(key);
    }
  }

  static async setCacheRespone(cacheKey, respone, timeOut) {
    if (!respone) return;

    const serializerRespone = JSON.stringify(respone);
    await this.redisSetAsync(
      cacheKey,
      serializerRespone,
      "EX",
      Math.ceil(timeOut / 1000)
    );
  }
}

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;
  for (let index = 0; index < retryTimes; index++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      //đặt hàng
      const isReservation = true;
      if (isReservation) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return null;
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};
module.exports = {
  acquireLock,
  releaseLock,
  RedisService,
};
