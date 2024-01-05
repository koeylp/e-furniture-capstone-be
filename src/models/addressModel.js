const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  fullName: {
    type: String,
    maxlength: 50,
    minlength: 3,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = mongoose.model("Address", addressSchema);
