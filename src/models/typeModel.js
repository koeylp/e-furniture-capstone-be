const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Type";
const DOCUMENT_NAME = "Types";

const schema = new Schema(
  {
    name: { type: String, required: true },
    subTypes: { type: Array, default: [] },
    is_published: { type: Boolean, default: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, schema);
