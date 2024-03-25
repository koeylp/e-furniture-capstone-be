"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Delivery";
const DOCUMENT_NAME = "Delivery";

const schema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Order",
    },
    account_id: { type: String, required: true, ref: "Account" },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
