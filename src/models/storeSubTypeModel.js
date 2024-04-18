"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "StoreSubTypes";
const DOCUMENT_NAME = "StoreSubType";

const schema = new Schema(
  {
    type: { type: String, required: true },
    code: { type: String, required: true },
    subTypes: { type: Array },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
