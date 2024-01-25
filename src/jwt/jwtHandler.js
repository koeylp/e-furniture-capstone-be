const crypto = require("crypto");
const { generateToken } = require("./jwtUtils");
const { NotFoundError } = require("../utils/errorHanlder");
const TokenService = require("../services/tokenService");

const createToken = async (payload) => {
  const { privateKey, publicKey } = await crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
  const token = await generateToken({ payload, privateKey });
  if (!token.access_token || !token.refresh_token) {
    throw new NotFoundError("Cannot Login To System!");
  }
  await TokenService.createTokenContain({
    account_id: payload.account_id,
    public_key: publicKey,
    refresh_token: token.refresh_token,
  });
  return token;
};
module.exports = {
  createToken,
};
