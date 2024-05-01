"use strict";
const slugify = require("slugify");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Rooms";
const DOCUMENT_NAME = "Room";

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumb: { type: String, required: true },
    slug: { type: String },
    products: [
      {
        product: { type: String, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    model3D: { type: String },
    is_draft: { type: Boolean, default: true },
    is_published: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
schema.pre("updateOne", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true });
  }
  next();
});
module.exports = model(DOCUMENT_NAME, schema);
