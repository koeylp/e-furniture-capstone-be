// src/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
const { formatToken } = require("../utils/format");
const { publicKey, accessTokenOptions, refreshTokenOptions } = require("../jwt/jwtConfig");
// const client = require("../databases/initRedis");

// client.set("foo", "khoi");
// client.get("foo", (err, result) => {
//   console.log(result);
// })

class AuthService {
  static async login(username, password) {
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
    const decodedAccessToken = jwt.verify(newAccessToken, publicKey, accessTokenOptions);
    const accessToken = {
      token: newAccessToken,
      exp: formatToken(decodedAccessToken).exp,
    };

    const newRefreshToken = generateRefreshToken(user);
    const decodedRefreshToken = jwt.verify(newRefreshToken, publicKey, refreshTokenOptions);
    const refreshToken = {
      token: newRefreshToken,
      exp: formatToken(decodedRefreshToken).exp,
    };

    return { accessToken, refreshToken, user };
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
