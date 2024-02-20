"use strict";
const slugify = require("slugify");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "SubTypeGroups";
const DOCUMENT_NAME = "SubTypeGroup";

const schema = new Schema(
  {
    label: { type: String, required: true },
    slug: { type: String },
    status: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
schema.pre("save", function (next) {
  this.slug = slugify(this.label, { lower: true });
  next();
});
module.exports = {
  _Product: model(DOCUMENT_NAME, schema),
};
