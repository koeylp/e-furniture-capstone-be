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
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    longitude: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    location: { type: String, required: true },
    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
