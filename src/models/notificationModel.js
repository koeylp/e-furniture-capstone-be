"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Notification";
const DOCUMENT_NAME = "Notifications";

const schema = new Schema(
  {
    account_id: { type: String, required: true, ref: "Accounts" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
