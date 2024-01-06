// src/controllers/authController.js
const AuthService = require("../services/AuthService");
const JwtUtils = require("../jwt/jwtUtils");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { error, accessToken, refreshToken, user } = await AuthService.login(
    username,
    password
  );

  if (error) {
    res.status(401).json({ message: "Authentication failed", error });
  } else {
    res.status(200).json({ accessToken, refreshToken, user });
  }
});

const logout = asyncHandler(async (req, res) => {
  const { error, message } = await AuthService.logout();

  if (error) {
    res.status(500).json({ message: "Logout failed", error });
  } else {
    res.clearCookie("token");
    res.status(204).end(); // No Content
  }
});

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { error, user } = await AuthService.register(username, password);

  if (error) {
    res.status(400).json({ message: "Registration failed", error });
  } else {
    res.status(201).json({ user });
  }
});

module.exports = { login, logout, register };
