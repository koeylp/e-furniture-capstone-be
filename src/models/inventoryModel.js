"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Inventory";
const DOCUMENT_NAME = "Inventories";

const schema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    location: { type: String, default: "unKnow" },
    stock: { type: Number, default: 1 },
    isSystem: { type: Number, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
