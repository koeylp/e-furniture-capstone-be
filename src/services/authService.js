// src/services/authService.js
const {
  InternalServerError,
  BadRequestError,
} = require("../utils/errorHanlder");
const TokenService = require("../services/tokenService");
const AccountRepository = require("../models/repositories/accountRepository");
const client = require("../databases/initRedis");
const { promisify } = require("util");
const { hashCode, encryptCode } = require("../utils/hashCode");
const { createToken } = require("../jwt/jwtHandler");

class AuthService {
  static async login(username, password) {
    const setAsync = promisify(client.set).bind(client);
    const userCheck = await AccountRepository.findAccountByUsername(username);
    if (!userCheck) throw new BadRequestError("Invalid Username!");
    const isValid = await encryptCode(password, userCheck.password);
    if (!isValid) throw new BadRequestError();
    const token = await createToken({
      account_id: userCheck._id.toString(),
      username: userCheck.username,
      role: userCheck.role,
    });

    await setAsync(
      `access_token_efurniture_${userCheck._id.toString()}`,
      token.access_token
    );
    await setAsync(
      `refresh_token_efurniture_${userCheck._id.toString()}`,
      token.refresh_token
    );
    return token;
  }

  static async logout(account_id) {
    await Promise.all([
      TokenService.deleteToken(account_id),
      client.del(`access_token_efurniture_${account_id}`),
      client.del(`refresh_token_efurniture_${account_id}`),
    ]);
    return 1;
  }
  static async register(payload) {
    if (payload.password !== payload.confirm_password)
      throw new BadRequestError();
    const userCheck = await AccountRepository.findAccountByUsername(
      payload.username
    );
    if (userCheck) throw new BadRequestError("Username is already in use!");
    const hashPassword = await hashCode(payload.password);
    payload.password = hashPassword;
    return await AccountRepository.createAccount(payload);
  }
}

module.exports = AuthService;
