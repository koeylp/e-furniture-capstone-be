// src/controllers/authController.js
const AuthService = require("../services/authService");
const { OK } = require("../utils/successHandler");
const { validateUsername, validatePassword } = require("../utils/validation");
const { BadRequestError } = require("../utils/errorHanlder");


class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;

    // validation
    // const usernameError = validateUsername(username).error;
    // if (usernameError) {
    //   throw new BadRequestError(usernameError);
    // }

    // const passwordError = validatePassword(password).error;
    // if (passwordError) {
    //   throw new BadRequestError(passwordError);
    // }

    // Check if username or password is missing
    if (!username || !password) {
      throw new BadRequestError("Username or password is missing");
    }

    return new OK({
      message: "Success",
      metaData: await AuthService.login(username, password),
    }).send(res);
  }

  static async logout(req, res) {
    const { error, message } = await AuthService.logout();

    if (error) {
      res.status(500).json({ error });
    } else {
      res.clearCookie("token");
      res.status(200).json({ message });
    }
  }

  static async register(req, res) {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      throw new BadRequestError("Username or password is missing");
    }
    return new OK({
      message: "Register Successfully!",
      metaData: await AuthService.register(username, password),
    }).send(res);
  }
}

module.exports = AuthController;
