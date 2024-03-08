"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Warehouses";
const DOCUMENT_NAME = "Warehouse";

const schema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        stock: { type: Number, required: true },
      },
    ],
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    location: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
