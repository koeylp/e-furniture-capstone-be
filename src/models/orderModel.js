"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "Order";

const schema = new Schema(
  {
    account_id: { type: String, required: true, ref: "Account" },
    order_checkout: { type: Array, required: true },
    payment: {
      type: String,
      enum: ["Online Payment, COD"],
      default: "Online Payment",
    },
    total_price: { type: Number, required: true },
    address: { type: Array, required: true },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
