// src/controllers/authController.js
const AuthService = require("../services/authService");
const { OK } = require("../utils/successHandler");
const {
  validateUsername,
  validatePassword,
  validateCreateAccount,
} = require("../utils/validation");
const { BadRequestError } = require("../utils/errorHanlder");

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequestError("Username or password is missing");
    }
    const token = await AuthService.login(username, password);
    return new OK({
      message: "Success",
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
    }).send(res);
  }

  static async logout(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Success",
      metaData: await AuthService.logout(account_id),
    }).send(res);
  }

  static async register(req, res) {
    const { error } = validateCreateAccount(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Register Successfully!",
      metaData: await AuthService.register(req.body),
    }).send(res);
  }
}

module.exports = AuthController;
