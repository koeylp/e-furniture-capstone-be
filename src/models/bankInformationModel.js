"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "BankInformations";
const DOCUMENT_NAME = "BankInformation";

const schema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    account_number: { type: String, required: true },
    template: {
      type: String,
      default: "compact",
      enums: ["compact", "compact2", "qr_only", "print"],
    },
    bank_logo: { type: String, required: true },
    bank_code: { type: String, required: true },
    bank_name: { type: String, required: true },
    bank_account_name: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
