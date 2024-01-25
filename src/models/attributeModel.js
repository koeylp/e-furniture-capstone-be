"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Attributes";
const DOCUMENT_NAME = "Attribute";

const schema = new Schema(
  {
    name: { type: String },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
