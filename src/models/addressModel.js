"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Address";
const DOCUMENT_NAME = "Addresses";

const schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "Accounts" },
    fullName: { type: String, maxlength: 50, minlength: 3, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
