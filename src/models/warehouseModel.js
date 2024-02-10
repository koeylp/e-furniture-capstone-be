"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Warehouses";
const DOCUMENT_NAME = "Warehouse";

const schema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    location: { type: String, default: "unKnow" },
    stock: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
