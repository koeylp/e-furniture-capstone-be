"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "ApiKeys";
const DOCUMENT_NAME = "ApiKey";

const schema = new Schema(
  {
    key: { type: String, required: true },
    version: { type: String, required: true },
    đescription: { type: String, default: "" },
    status: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
