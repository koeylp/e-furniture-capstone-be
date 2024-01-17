"use strict";
const slugify = require("slugify");
const { model, Schema } = require("mongoose");

const COLLECTION_NAME = "Product";
const DOCUMENT_NAME = "Products";

const schema = new Schema(
  {
    name: { type: String, required: true },
    thumb: { type: String, required: true },
    slug: { type: String },
    price: { type: Number, required: true },
    type: { type: String, enum: ["Sofa", "Chair", "Beds"] },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, required: true, ref: "Shops" },
    room: { type: Schema.Types.ObjectId, required: true, ref: "Rooms" },
    ratingAvarage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating muse be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    attributes: { type: Schema.Types.Object, required: true },
    model3D: { type: Schema.Types.Object },
    status: { type: Number, default: 0 },
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
//ATTRIBUTE

const sofaSchema = new Schema(
  {
    type: { type: String },
    description: { type: String, required: true },
    thumb: { type: String },
    attributes: [
      {
        name: string,
        type: string,
      },
    ],
    products: { type: Array },
  },
  {
    collection: "Sofa",
    timestamps: true,
  }
);
const ArmChairSchema = new Schema(
  {
    type: { type: String },
    description: { type: String, required: true },
    thumb: { type: String },
    products: { type: Array },
  },
  {
    collection: "AirChair",
    timestamps: true,
  }
);
const ChairSchema = new Schema(
  {
    type: { type: String },
    description: { type: String, required: true },
    thumb: { type: String },
    products: { type: Array },
  },
  {
    collection: "Chair",
    timestamps: true,
  }
);
module.exports = {
  _Product: model(DOCUMENT_NAME, schema),
  _Sofa: model("Sofas", sofaSchema),
  __Armchair: model("Armchairs", ArmChairSchema),
  _Chair: model("Chairs", ChairSchema),
};
