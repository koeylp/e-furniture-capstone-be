"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Transactions";
const DOCUMENT_NAME = "Transaction ";

const schema = new Schema(
  {
    receiver: { type: Object },
    sender: { type: Object },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["Income", "Outcome"],
      default: "Income",
    },
    date: { type: Date, default: new Date() },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
