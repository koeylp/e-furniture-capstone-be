"use strict";
const { number } = require("joi");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Showroom";
const DOCUMENT_NAME = "Showroom";

const schema = new Schema(
  {
    roomle_3d_id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    products: { type: Array, default: [] },
    description: { type: String },
    status: { type: number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
