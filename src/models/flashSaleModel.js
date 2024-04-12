"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "FlashSales";
const DOCUMENT_NAME = "FlashSale";

const schema = new Schema(
  {
    name: { type: String },
    startDay: { type: Date, required: true },
    endDay: { type: Date, required: true },
    thumb: { type: String, required: true },
    background: { type: String, required: true },
    products: [
      {
        productId: { type: String, ref: "Product" },
        count: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        salePrice: { type: Number },
        oldSalePrice: { type: Number },
      },
    ],
    cron: { type: String, default: "" },
    is_draft: { type: Boolean, default: true },
    is_published: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
