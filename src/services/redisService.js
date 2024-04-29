const { promisify } = require("util");

const redisClient = require("../databases/initRedis");
const StockUtil = require("../utils/stockUtil");
const WareHouseService = require("./warehouseService");
const { BadRequestError } = require("../utils/errorHanlder");

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

// class RedisService {
//   constructor(redisClient) {
//     this.redisClient = redisClient;
//     this.redisGetAsync = promisify(redisClient.get).bind(redisClient);
//     this.redisKeysAsync = promisify(redisClient.keys).bind(redisClient);
//     this.redisDelAsync = promisify(redisClient.del).bind(redisClient);
//     this.redisSetAsync = promisify(redisClient.set).bind(redisClient);
//   }

//   static async getCacheRespone(cacheKey) {
//     const cacheRespone = await this.redisGetAsync(cacheKey);
//     return cacheRespone || null;
//   }

//   static async removeCacheRespone(pattern) {
//     if (!pattern.trim()) {
//       throw new Error("Pattern cannot be empty");
//     }

//     const keys = await this.redisKeysAsync(pattern + "*");
//     for (const key of keys) {
//       await this.redisDelAsync(key);
//     }
//   }

//   static async setCacheRespone(cacheKey, respone, timeOut) {
//     if (!respone) return;

//     const serializerRespone = JSON.stringify(respone);
//     await this.redisSetAsync(
//       cacheKey,
//       serializerRespone,
//       "EX",
//       Math.ceil(timeOut / 1000)
//     );
//   }
// }
const handleProductsOrder = async (account_id, order) => {
  await acquireLock(account_id, order)
    .then(async (key) => {
      if (key) {
        await releaseLock(key);
      }
    })
    .catch((error) => {
      throw new BadRequestError(error);
    });
};
const acquireLock = async (account_id, order) => {
  const key = `lock_efurniture_${account_id}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let index = 0; index < retryTimes; index++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      try {
        await this.verifyProducts(order);
        await this.handleStock(order);
        await pexpire(key, expireTime);
        return key;
      } catch (ex) {
        return Promise.reject(ex);
      } finally {
        await pexpire(key, expireTime);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return Promise.reject(new BadRequestError("Lock acquisition failed"));
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

const verifyProducts = async (order) => {
  const products = order.order_products;
  for (const product of products) {
    product.product = await StockUtil.checkProductStock(product);
  }
  return products;
};
const handleStock = async (order) => {
  const products = order.order_products;
  for (const product of products) {
    await StockUtil.updateInventoryStock(product);
    await WareHouseService.increaseProductSold(product, product.quantity);
    await WareHouseService.decreaseProductStock(product, product.quantity);
  }
};
module.exports = {
  acquireLock,
  releaseLock,
  handleProductsOrder,
};
