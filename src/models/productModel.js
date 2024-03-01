"use strict";
const slugify = require("slugify");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";

const schema = new Schema(
  {
    name: { type: String, required: true },
    thumbs: { type: Array, required: true },
    description: { type: String, required: true },
    slug: { type: String },
    regular_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    type: { type: Schema.Types.ObjectId, required: true, ref: "Types" },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    variation: [
      {
        material: { type: String, required: true },
        subPrice: { type: Number, required: true },
      },
    ],
    attributes: {
      type: { type: Array, required: true },
      attributeType: { type: Schema.Types.Mixed },
    },
    model3D: { type: String },
    is_draft: { type: Boolean, default: true },
    is_published: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
schema.index({ name: "text" });
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
schema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true });
  }
  next();
});
module.exports = {
  _Product: model(DOCUMENT_NAME, schema),
};
