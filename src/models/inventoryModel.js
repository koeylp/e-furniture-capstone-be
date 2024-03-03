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
    stock: { type: Number, required: true },
    sold: { type: Number, required: true, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
