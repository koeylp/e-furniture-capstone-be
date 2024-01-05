// src/controllers/authController.js
const AuthService = require("../services/AuthService");
const JwtUtils = require("../jwt/jwtUtils");

const login = async (req, res) => {
  const { username, password } = req.body;
  const { error, user } = await AuthService.login(username, password);

  if (error) {
    res.status(400).json({ message: error });
  } else {
    const token = JwtUtils.generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ token, user });
  }
};

const logout = async (req, res) => {
  const { error, message } = await AuthService.logout();

  if (error) {
    res.status(500).json({ error });
  } else {
    res.clearCookie("token");
    res.status(200).json({ message });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const { error, user } = await AuthService.register(username, password);

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(201).json({ user });
  }
};

module.exports = { login, logout, register };
