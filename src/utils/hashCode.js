const bcrypt = require("bcrypt");
const { InternalServerError } = require("./errorHanlder");
const hashCode = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashCode = await bcrypt.hash(salt, password);
    return hashCode;
  } catch (error) {
    throw new InternalServerError("Error Hashed Code!");
  }
};
const encryptCode = async (password, hashPassword) => {
  try {
    const isValid = await bcrypt.compare(password, hashPassword);
    return isValid;
  } catch (error) {
    throw new InternalServerError("Error Encrypt Code!");
  }
};
module.exports = {
  hashCode,
  encryptCode,
};
