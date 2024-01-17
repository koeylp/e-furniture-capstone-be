"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Token";
const DOCUMENT_NAME = "Tokens";

const schema = new Schema(
  {
    account_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Accounts",
    },
    public_key: { type: String, required: true },
    refresh_token: { type: String, required: true },
    token_used: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
