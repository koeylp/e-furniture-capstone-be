"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "Order";

const schema = new Schema(
  {
    account_id: { type: String, ref: "Account" },
    order_checkout: { type: Object, required: true },
    order_products: { type: Array, required: true },
    payment: {
      type: String,
      enum: ["Online Payment", "COD"],
      default: "Online Payment",
    },
    order_shipping: { type: Object, required: true },
    order_tracking: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipping", "Done", "Cancel"],
      default: "Pending",
    },
    guest: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
