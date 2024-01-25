// subtype-factory.js
const { model, Schema } = require("mongoose");

function generateSubTypeSchema(type) {
  const subTypeCollectionName = `${type.name}`;

  const subTypeSchema = new Schema(
    {
      type: { type: String, required: true },
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
    },
    {
      collection: subTypeCollectionName,
      timestamps: true,
    }
  );

  return model(subTypeCollectionName, subTypeSchema);
}

module.exports = { generateSubTypeSchema };
