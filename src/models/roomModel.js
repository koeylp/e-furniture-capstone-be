"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Rooms";
const DOCUMENT_NAME = "Room";

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumb: { type: String, required: true },
    status: { type: Number, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
