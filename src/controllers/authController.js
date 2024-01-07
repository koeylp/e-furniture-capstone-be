// src/controllers/authController.js
const AuthService = require("../services/AuthService");
const JwtUtils = require("../jwt/jwtUtils");
const { OK } = require("../utils/successHandler");

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    console.log(username, password);
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
    return new OK({
      message: "Register Successfully!",
      metaData: await AuthService.register(username, password),
    }).send(res);
  }
}

module.exports = AuthController;
