"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Attribute";
const DOCUMENT_NAME = "Attributes";

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
