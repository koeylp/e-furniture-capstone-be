"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Districts";
const DOCUMENT_NAME = "District";

const schema = new Schema(
  {
    name: { type: String },
    totalOrder: { type: Number, default: "String" },
    latitue: { type: Number, default: 0 },
    longtitue: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
