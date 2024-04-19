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

module.exports = model(DOCUMENT_NAME, schema);
