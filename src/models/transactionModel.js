"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Transactions";
const DOCUMENT_NAME = "Transaction ";

const schema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    order_id: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    when: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
