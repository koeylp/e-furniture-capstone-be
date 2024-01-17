const jwt = require("jsonwebtoken");
const { publicKey } = require("../jwt/jwtConfig");
const { formatToken } = require("../utils/format");
const client = require("../databases/initRedis");
const RefreshToken = require("../models/refreshTokenModel");
const { generateAccessToken } = require("../jwt/jwtUtils");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = await new Promise((resolve, reject) => {
    client.get("token", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  const refreshToken = await new Promise((resolve, reject) => {
    client.get("refreshToken", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  console.log(formatToken(jwt.verify(refreshToken, publicKey)));

  if (!token) {
    return res.status(401).send("Unauthorized - Missing token");
  }

  jwt.verify(token, publicKey, async (err, payload) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log(refreshToken);
        jwt.verify(refreshToken, publicKey, async (err, payload) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              return res.status(403).json({
                message: err.message,
              });
            }
            console.log(err);
            next(err);
          }

          const user =
            (await User.findOne({ _id: payload.userId })) ||
            (() => {
              throw new NotFoundError(
                `User not found with username: ${payload.userId}`
              );
            })();

          const token = generateAccessToken(user);
          console.log(token);
          client.set("token", token, "EX", 60 * 60, (err) => {
            if (err) console.log(err);
          });
          next();
        });
      } else {
        console.log(err);
        next(err);
      }
    }
  });
};

module.exports = authenticateUser;
