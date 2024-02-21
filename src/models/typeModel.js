const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const COLLECTION_NAME = "Type";
const DOCUMENT_NAME = "Types";

const schema = new Schema(
  {
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    slug: { type: String },
    subTypes: { type: Array, default: [] },
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

module.exports = model(DOCUMENT_NAME, schema);
