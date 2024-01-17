"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Cart";
const DOCUMENT_NAME = "Carts";

const schema = new Schema(
  {
    account_id: { type: String, required: true, ref: "Accounts" },
    products: { type: Array, default: [] },
    count_product: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
