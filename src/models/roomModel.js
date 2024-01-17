"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Room";
const DOCUMENT_NAME = "Rooms";

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumb: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
