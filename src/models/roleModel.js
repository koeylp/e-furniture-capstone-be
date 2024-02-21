"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Roles";
const DOCUMENT_NAME = "Role";

const schema = new Schema(
  {
    role: { type: String },
    value: { type: Number, default: "String" },
    permission: { type: String, required: true },
    action: { type: String, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
