"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Warehouses";
const DOCUMENT_NAME = "Warehouse";

const schema = new Schema(
  {
    products: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        variation: { type: Array, required: true },
        code: { type: String, required: true },
        stock: { type: Number, required: true },
        lowStock: { type: Number, default: 0 },
        isNoti: { type: Boolean, default: false },
        is_draft: { type: Boolean, default: false },
        is_published: { type: Boolean, default: true },
      },
    ],
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    location: { type: String, required: true },
    is_draft: { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
