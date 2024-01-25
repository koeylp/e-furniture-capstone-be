const JWT = require("jsonwebtoken");
const { UnAuthorizedError, ForbiddenError } = require("../utils/errorHanlder");
const TokenService = require("../services/tokenService");
const { createToken } = require("../jwt/jwtHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "x-client-refreshtoken",
  ACCESSTOKEN: "x-client-accesstoken",
};
const verifyToken = async (req, res, next) => {
  try {
    const access_token = req.headers[HEADER.ACCESSTOKEN];
    const refresh_token = req.headers[HEADER.REFRESHTOKEN];
    const account_id = req.headers[HEADER.CLIENT_ID];
    if (!access_token || !refresh_token || !account_id)
      throw new UnAuthorizedError();
    const key_token = await TokenService.findToken({
      account_id,
      refresh_token,
    });
    if (!key_token) throw new ForbiddenError();

    const payload_access_token = verifyAccessToken(
      access_token,
      key_token.public_key
    );

    if (payload_access_token == 0) {
      const payload_refresh_token = verifyRefreshToken(
        refresh_token,
        key_token.public_key
      );
      const token = await createToken({
        account_id: payload_refresh_token.account_id,
        username: payload_refresh_token.username,
        role: payload_refresh_token.role,
      });
      req.payload = payload_refresh_token;
      req.accessToken = token.access_token;
      req.refreshToken = token.refresh_token;
      next();
      return;
    }
    if (account_id !== payload_access_token.account_id) {
      throw new UnAuthorizedError();
    }
    req.payload = payload_access_token;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyAccessToken = (token, public_key) => {
  try {
    const payload = JWT.verify(token, public_key);
    return payload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return 0;
    }
    throw new ForbiddenError();
  }
};
const verifyRefreshToken = (token, public_key) => {
  try {
    const payload = JWT.verify(token, public_key);
    return payload;
  } catch (err) {
    throw new ForbiddenError("Access Expried");
  }
};

module.exports = {
  verifyToken,
};
