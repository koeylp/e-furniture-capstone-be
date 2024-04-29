// src/services/authService.js
const { BadRequestError, ForbiddenError } = require("../utils/errorHanlder");
const TokenService = require("../services/tokenService");
const AccountRepository = require("../models/repositories/accountRepository");
// const client = require("../databases/initRedis");
// const { promisify } = require("util");
const { hashCode, encryptCode } = require("../utils/hashCode");
const { createToken } = require("../jwt/jwtHandler");
const { verifyRefreshToken } = require("../jwt/verifyToken");
const { checkPermissionLogin } = require("../utils/authUtils");

class AuthService {
  static async login(username, password, role_login = "login_user") {
    // const setAsync = promisify(client.set).bind(client);
    const userCheck = await AccountRepository.findAccountByUsername(username);
    if (!userCheck) throw new BadRequestError("Invalid Username!");
    const isValid = await encryptCode(password, userCheck.password);
    if (!isValid) throw new BadRequestError();
    const checkPermission = await checkPermissionLogin(
      userCheck.role,
      role_login
    );
    if (!checkPermission)
      throw new BadRequestError("Cannot Login To eFurniture");
    const token = await createToken({
      account_id: userCheck._id.toString(),
      username: userCheck.username,
      role: userCheck.role,
    });

    // await setAsync(
    //   `access_token_efurniture_${userCheck._id.toString()}`,
    //   token.access_token
    // );
    // await setAsync(
    //   `refresh_token_efurniture_${userCheck._id.toString()}`,
    //   token.refresh_token
    // );
    return token;
  }
  static async loginUser(username, password) {
    return await this.login(username, password, "login_user");
  }
  static async loginEfurniture(username, password) {
    return await this.login(username, password, "login_efurniture");
  }
  static async loginDelivery(username, password) {
    return await this.login(username, password, "login_delivery");
  }

  static async logout(account_id) {
    await Promise.all([
      TokenService.deleteToken(account_id),
      // client.del(`access_token_efurniture_${account_id}`),
      // client.del(`refresh_token_efurniture_${account_id}`),
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
  static async refreshToken(account_id, refresh_token) {
    const key_token = await TokenService.findToken({
      account_id,
      refresh_token,
    });
    if (!key_token) throw new ForbiddenError();
    const payload_refresh_token = verifyRefreshToken(
      refresh_token,
      key_token.public_key
    );
    const token = await createToken({
      account_id: payload_refresh_token.account_id,
      username: payload_refresh_token.username,
      role: payload_refresh_token.role,
    });
    return token;
  }
}

module.exports = AuthService;
