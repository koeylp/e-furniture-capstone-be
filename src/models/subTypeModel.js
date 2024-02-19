// subtype-factory.js
const { model, Schema, default: mongoose } = require("mongoose");
const slugify = require("slugify");
function generateSubTypeSchema(type) {
  const subTypeCollectionName = `${type.name}`;

  const subTypeSchema = new Schema(
    {
      type: { type: String, required: true },
      slug: { type: String },
      description: { type: String, default: "" },
      thumb: { type: String, default: "" },
      attributes: [
        {
          _id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Attribute",
          },
          type: {
            type: String,
            default: "String",
          },
        },
      ],
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
module.exports = { generateSubTypeSchema, deleteSubTypeSchema };
