"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Account";
const DOCUMENT_NAME = "Accounts";

const schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    avatar: { type: String, required: true },
    role: { type: Number, default: 30 },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
