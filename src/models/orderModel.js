"use strict";
const { model, Schema } = require("mongoose");
const { generateOrderCode } = require("../utils/generateOrderCode");

const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "Order";

const schema = new Schema(
  {
    account_id: { type: String, ref: "Account" },
    order_code: { type: String, required: true, default: generateOrderCode() },
    order_checkout: {
      final_total: { type: Number },
      total: { type: Number, required: true },
      voucher: { type: Object },
      is_paid: { type: Boolean, default: false },
    },
    order_products: { type: Array, required: true },
    payment_method: {
      type: String,
      enum: ["Online Payment", "COD"],
      default: "Online Payment",
    },
    order_shipping: { type: Object, required: true },
    guest: { type: Boolean, default: false },
    order_tracking: [
      {
        name: {
          type: String,
          required: true,
          enum: [
            "Pending",
            "Processing",
            "Shipping",
            "Done",
            "Cancel",
            "Failed",
            "Refunded",
          ],
          default: "Pending",
        },
        note: { type: Schema.Types.Mixed },
        date: { type: Date, default: Date.now },
      },
    ],
    status: { type: Number, default: 1 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
