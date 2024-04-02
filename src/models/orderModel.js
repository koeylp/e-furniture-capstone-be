"use strict";
const { model, Schema } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "Order";

const schema = new Schema(
  {
    account_id: { type: String, ref: "Account" },
    order_code: {
      type: String,
      required: true,
      unique: true,
    },
    order_checkout: {
      final_total: { type: Number },
      total: { type: Number, required: true },
      voucher: { type: Object },
      is_paid: { type: Boolean, default: false },
    },
    order_products: [
      {
        _id: false,
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: Number, default: 0 },
      },
    ],
    payment_method: {
      type: String,
      enum: ["Online Payment", "COD"],
      default: "Online Payment",
    },
    order_shipping: { type: Object, required: true },
    guest: { type: Boolean, default: false },
    order_tracking: [
      {
        _id: false,
        name: {
          type: String,
          required: true,
          enum: [
            "Pending",
            "Processing",
            "Shipping",
            "Done",
            "Cancelled",
            "Refunded",
          ],
          default: "Pending",
        },
        note: { type: Schema.Types.Mixed },
        date: { type: Date, default: Date.now },
        status: { type: Number, default: 1 },
        substate: [
          {
            _id: false,
            name: { type: String },
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    status: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
schema.plugin(mongooseLeanVirtuals);
schema.virtual("current_order_tracking").get(function () {
  if (this.order_tracking && this.order_tracking.length > 0) {
    const latestStatus = this.order_tracking[this.order_tracking.length - 1];
    return latestStatus;
  }
  return "No tracking available";
});

module.exports = model(DOCUMENT_NAME, schema);
