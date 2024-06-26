"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Wishlist";
const DOCUMENT_NAME = "Wishlist";

const schema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    products: [{ type: String, required: true, ref: "Product" }],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
