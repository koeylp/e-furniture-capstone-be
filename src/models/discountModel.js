"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Discounts";
const DOCUMENT_NAME = "Discount";

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage"],
    },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    max_use: { type: Number, required: true },
    uses_count: { type: Number, default: 0 },
    users_used: { type: Array, default: [] },
    max_uses_per_user: { type: Number, default: 1 },
    min_order_value: { type: Number, default: 0 },
    is_system: { type: Number, default: 0 },
    is_active: { type: Number, default: 0 },
    applies_to: { type: String, required: true, enum: ["all", "specific"] },
    product_ids: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
