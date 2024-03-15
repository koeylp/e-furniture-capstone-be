"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "FeedBacks";
const DOCUMENT_NAME = "FeedBack";

const schema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    account_id: { type: Schema.Types.ObjectId, ref: "Account" },
    content: { type: String, default: "text" },
    rating: { type: Number, default: 3 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
