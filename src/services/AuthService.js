// src/services/authService.js
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../jwt/jwtUtils");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errorHanlder");
const { validateUsername, validatePassword } = require("../utils/validation");
const { error } = require("winston");
class AuthService {
  static async login(username, password) {
    try {
      // validation 
      // const usernameValidation = validateUsername(username);
      // if (usernameValidation) {
      //   throw new BadRequestError(usernameValidation.error);
      // }

      // const passwordValidation = validatePassword(password);
      // if (passwordValidation) {
      //   throw new BadRequestError(passwordValidation.error);
      // }

      // Check if username or password is missing
      if (!username || !password) {
        throw new BadRequestError("Username or password is missing");
      }

      // find user by username
      const user =
        (await User.findOne({ username })) ||
        (() => {
          throw new NotFoundError(`User not found with username: ${username}`);
        })();

      // check if user's password is correct
      const isMatch =
        (await bcrypt.compare(password, user.password)) ||
        (() => {
          throw new BadRequestError("Incorrect password");
        })();

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return { newAccessToken, newRefreshToken, user };
    } catch (error) {
      return { error: error.message };
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

    // Check if username or password is missing
    if (!username || !password) {
      throw new BadRequestError("Username or password is missing");
    }

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
