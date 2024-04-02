"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "NotificationEfurnitures";
const DOCUMENT_NAME = "NotificationEfurniture";

const schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
