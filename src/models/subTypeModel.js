// subtype-factory.js
const { model, Schema, default: mongoose } = require("mongoose");
const slugify = require("slugify");
function generateSubTypeSchema(type) {
  const subTypeCollectionName = `${type.name}`;
  // const existingSchema = mongoose.model(subTypeCollectionName);
  // if (existingSchema) {
  //   console.log(`Schema for "${subTypeCollectionName}" already exists.`);
  //   return;
  // }
  const subTypeSchema = new Schema(
    {
      type: { type: String, required: true },
      slug: { type: String },
      description: { type: String, default: "" },
      thumb: { type: String, default: "" },
      attributes: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Attribute",
        },
      ],
      group: { type: String, required: true, ref: "SubTypeGroup" },
      products: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
        },
      ],
      is_draft: { type: Boolean, default: true },
      is_published: { type: Boolean, default: false },
    },
    {
      collection: subTypeCollectionName,
      timestamps: true,
    }
  );
  subTypeSchema.pre("save", function (next) {
    this.slug = slugify(this.type, { lower: true });
    next();
  });
  subTypeSchema.pre("updateOne", function (next) {
    const update = this.getUpdate();
    if (update.name) {
      update.slug = slugify(update.name, { lower: true });
    }
    next();
  });
  subTypeSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.name) {
      update.slug = slugify(update.name, { lower: true });
    }
    next();
  });
  return model(subTypeCollectionName, subTypeSchema);
}
async function deleteSubTypeSchema(type) {
  const collectionName = `${type.name}`;
  const existingModel = mongoose.modelNames().includes(collectionName);
  if (existingModel) {
    mongoose.connection.deleteModel(collectionName);
  }
  // Xóa collection
  const mon = await mongoose.connection.db.dropCollection(collectionName);
}
function publishSubTypeSchema(type) {
  const subTypeCollectionName = `${type.name}`;
  const existingSchema = mongoose.model(subTypeCollectionName);
  if (existingSchema) {
    return existingSchema;
  }
  const subTypeSchema = new Schema(
    {
      type: { type: String, required: true },
      slug: { type: String },
      description: { type: String, default: "" },
      thumb: { type: String, default: "" },
      attributes: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Attribute",
        },
      ],
      group: { type: String, required: true, ref: "SubTypeGroup" },
      products: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
        },
      ],
      is_draft: { type: Boolean, default: true },
      is_published: { type: Boolean, default: false },
    },
    {
      collection: subTypeCollectionName,
      timestamps: true,
    }
  );
  subTypeSchema.pre("save", function (next) {
    this.slug = slugify(this.type, { lower: true });
    next();
  });
  subTypeSchema.pre("updateOne", function (next) {
    const update = this.getUpdate();
    if (update.name) {
      update.slug = slugify(update.name, { lower: true });
    }
    next();
  });
  subTypeSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.name) {
      update.slug = slugify(update.name, { lower: true });
    }
    next();
  });
  return model(subTypeCollectionName, subTypeSchema);
}
module.exports = {
  generateSubTypeSchema,
  deleteSubTypeSchema,
  publishSubTypeSchema,
};
