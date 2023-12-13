const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = mongoose.model("User", userSchema);
