"use strict";
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Transactions";
const DOCUMENT_NAME = "Transaction ";

const schema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    account_Bank_Id: { type: String, required: true },
    amount: { type: Number, required: true },
    bank_Code_Name: { type: String, required: true },
    bank_Sub_Acc_Id: { type: String, required: true },
    cusum_Balance: { type: String, required: true },
    description: { type: String, required: true },
    tid: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, schema);
