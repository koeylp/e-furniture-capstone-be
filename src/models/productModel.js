"use strict";
const slugify = require("slugify");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";

const schema = new Schema(
  {
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    slug: { type: String },
    price: { type: Number, required: true },
    type: { type: Schema.Types.ObjectId, required: true, ref: "Type" },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    room: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
    variation: [
      {
        material: { type: String, required: true },
        subPrice: { type: Number, required: true },
      },
    ],
    attributes: {
      type: { type: String, required: true },
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
module.exports = {
  _Product: model(DOCUMENT_NAME, schema),
};
