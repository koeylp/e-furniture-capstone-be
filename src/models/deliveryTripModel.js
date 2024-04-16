"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "DeliveryTrips";
const DOCUMENT_NAME = "DeliveryTrip";

const schema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    orders: [
      {
        order: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
        payment: { type: String, default: "COD" },
        amount: { type: Number },
        date: { type: Date, default: new Date() },
        status: { type: Number, default: 0 },
      },
    ],
    state: [
      {
        item: { type: Number, default: 0 },
        state: { type: String },
        stateValue: { type: Number },
        time: { type: Date, default: new Date() },
      },
    ],
    current_state: {
      item: { type: Number },
      state: { type: String },
      stateValue: { type: Number },
      time: { type: Date, default: new Date() },
    },
    warehouse: { type: Object },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
schema.index({ full_name: "text" });
module.exports = model(DOCUMENT_NAME, schema);
