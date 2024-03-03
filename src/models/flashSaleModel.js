"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "FlashSales";
const DOCUMENT_NAME = "FlashSale";

const schema = new Schema(
  {
    name: { type: String },
    startDay: { type: String, required: true },
    endDay: { type: String, required: true },
    products: [
      {
        productId: { type: String, ref: "Product" },
        count: { type: Number, required: true },
        salePrice: { type: Number },
      },
    ],
    cron: { type: String, default: "" },
    is_draft: { type: Boolean, default: true },
    is_published: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
