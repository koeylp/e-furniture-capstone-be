"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Carts";
const DOCUMENT_NAME = "Cart";

const schema = new Schema(
  {
    account_id: { type: String, required: true, ref: "Account" },
    products: [
      {
        _id: { type: String, required: true },
        variation: { type: Array },
        code: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    count_product: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
