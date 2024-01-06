// src/services/authService.js
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { generateToken } = require("../jwt/jwtUtils");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errorHanlder");
class AuthService {
  static async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new NotFoundError("Not Found User");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestError("Invalid credentials.");
    const token = generateToken(user);
    if (!token) throw new InternalServerError("");
    return { token, user };
  }

  static async logout() {
    try {
      return { error: null, message: "Logged out successfully." };
    } catch (error) {
      return { error: error.message, message: null };
    }
  }

  static async register(username, password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    if (!savedUser) throw new InternalServerError("Cannot Register User!");
    return savedUser;
  }
}

module.exports = AuthService;
