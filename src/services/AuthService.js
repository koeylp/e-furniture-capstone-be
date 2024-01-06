// src/services/authService.js
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../jwt/jwtUtils");
class AuthService {
  static async login(username, password) {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return { error: "User does not exist." };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return { error: "Invalid credentials." };
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return { accessToken, refreshToken, user };
    } catch (error) {
      return { error: error.message, accessToken: null, refreshToken: null };
    }
  }

  static async logout() {
    try {
      return { error: null, message: "Logged out successfully." };
    } catch (error) {
      return { error: error.message, message: null };
    }
  }

  static async register(username, password) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      return { error: null, user: savedUser };
    } catch (error) {
      return { error: error.message, user: null };
    }
  }
}

module.exports = AuthService;
