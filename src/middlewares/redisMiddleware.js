const redis = require("redis");
const { promisify } = require("util");
const { URLSearchParams } = require("url");
const { RedisService } = require("../services/redisService");

const redisClient = redis.createClient();
const redisGetAsync = promisify(redisClient.get).bind(redisClient);
const redisSetAsync = promisify(redisClient.set).bind(redisClient);

function cacheMiddleware(timeToLiveSeconds = 1000) {
  return async (req, res, next) => {
    const cacheKey = generateCacheKeyFromRequest(req);
    const cachedResult = await redisGetAsync(cacheKey);
    if (cachedResult) {
      res.status(200).json(JSON.parse(cachedResult));
      return;
    }
    const response = await next();
    if (response)
      await RedisService.setCacheRespone(
        cacheKey,
        response.metaData,
        timeToLiveSeconds
      );
    next();
  };
}

// Hàm tạo cache key từ request
function generateCacheKeyFromRequest(req) {
  const keyBuilder = [];
  keyBuilder.push(req.path);
  const queryParams = new URLSearchParams(req.query);
  queryParams.sort();
  for (const [key, value] of queryParams) {
    keyBuilder.push(`${key}-${value}`);
  }
  return keyBuilder.join("|");
}
