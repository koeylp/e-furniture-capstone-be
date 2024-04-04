"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Inventory";
const DOCUMENT_NAME = "Inventory";

const schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Product",
    },
    variation: { type: Array },
    code: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, required: true, default: 0 },
    is_draft: { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
