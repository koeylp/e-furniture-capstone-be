"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Districts";
const DOCUMENT_NAME = "District";

const schema = new Schema(
  {
    name: { type: String },
    totalOrder: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
