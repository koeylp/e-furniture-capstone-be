"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Addresses";
const DOCUMENT_NAME = "Address";

const schema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    address: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, schema);
