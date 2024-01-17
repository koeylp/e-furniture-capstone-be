"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Revenue";
const DOCUMENT_NAME = "Revenues";

const schema = new Schema(
  {
    profit: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date().setUTCHours(0, 0, 0, 0) },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
