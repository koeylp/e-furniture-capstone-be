"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Revenues";
const DOCUMENT_NAME = "Revenue";

const schema = new Schema(
  {
    //order : [
    //    {order: actualProfit, expectedProfit}
    //                 ]
    //đã trả
    actualProfit: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date().setUTCHours(0, 0, 0, 0) },
    status: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
