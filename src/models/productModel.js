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
    sale_price: { type: Number, default: 0 },
    variation: [
      {
        name: { type: String, required: true },
        properties: [
          {
            value: { type: String, required: true },
            sub_price: { type: Number, required: true },
          },
        ],
      },
    ],
    type: { type: Schema.Types.ObjectId, required: true, ref: "Types" },
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
schema.pre("save", async function (next) {
  let slugAttempt = slugify(this.name, { lower: true });
  let candidateSlug = slugAttempt;
  let docCount = await this.model(DOCUMENT_NAME).countDocuments({
    slug: candidateSlug,
  });

  while (docCount > 0) {
    candidateSlug = `${slugAttempt}-${docCount}`;
    docCount = await this.model(DOCUMENT_NAME).countDocuments({
      slug: candidateSlug,
    });
  }

  this.slug = candidateSlug;
  next();
});
module.exports = {
  _Product: model(DOCUMENT_NAME, schema),
};
