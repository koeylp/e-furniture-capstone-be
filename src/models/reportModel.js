const { Schema, model } = require("mongoose");

const COLLECTION_NAME = "Reports";
const DOCUMENT_NAME = "Report";

const schema = new Schema(
  {
    requester: { type: Object, required: true },
    note: { type: Schema.Types.Mixed, required: true },
    amount: { type: Number, required: true },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, schema);
