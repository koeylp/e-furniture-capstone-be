const { default: mongoose } = require("mongoose");
const { checkValidId, getUnSelectData, getSelectData } = require("../../utils");

class SubTypeRepository {
  static async createSubTypeValue(
    subTypeModel,
    subType,
    description,
    thumb,
    attributes
  ) {
    const result = await subTypeModel.create({
      type: subType,
      description,
      thumb,
      attributes,
    });
    if (!result) throw new InternalServerError("Cannot Add SubType Value!");
    return result;
  }
  static async getSubTypes(
    subTypeModel,
    option = ["_id", "type", "slug", "products"]
  ) {
    return await subTypeModel
      .find()
      .populate({
        path: "products.productId",
        model: "Product",
        select:
          "-is_draft -is_published -createdAt -updatedAt -__v -attributes -variation ",
      })
      .select(getSelectData(option));
  }
  static async getSubTypesWithoutPopulate(subTypeModel) {
    const option = ["_id", "type", "slug"];
    return await subTypeModel.find().select(getSelectData(option));
  }
  static async findSubTypeById(subtype_id, subTypeModel) {
    checkValidId(subtype_id);
    const query = {
      _id: new mongoose.Types.ObjectId(subtype_id),
    };
    return await subTypeModel
      .findOne(query)
      .select(getUnSelectData(["products", "attributes"]));
  }
  static async findSubTypeBySlug(
    slug,
    subTypeModel,
    option = ["products", "attributes", "updatedAt", "createdAt", "__v"]
  ) {
    const query = {
      slug: slug,
    };
    return await subTypeModel.findOne(query).select(getUnSelectData(option));
  }
  static async findSubTypeBySlugWithPopulate(slug, subTypeModel) {
    const query = {
      slug: slug,
    };
    return await subTypeModel
      .findOne(query)
      .select(getUnSelectData(["createdAt", "updatedAt", "__v", "attributes"]))
      .populate({
        path: "products.productId",
        model: "Product",
        select:
          "-is_draft -is_published -createdAt -updatedAt -__v -attributes -variation ",
      });
  }
  static async findSubTypeByName(name, subTypeModel) {
    const query = {
      type: name,
      is_published: true,
    };
    return await subTypeModel.findOne(query).lean();
  }
  static async addProductSubType(product_id, subTypeModel, type) {
    checkValidId(product_id);
    const query = {
      slug: type,
    };
    const update = {
      $push: {
        products: { productId: new mongoose.Types.ObjectId(product_id) },
      },
    };
    return await subTypeModel.updateOne(query, update, { isNew: true });
  }
  static async editSubType(subtype_id, subTypeModel, description, thumb) {
    const subType = await this.findSubTypeById(subtype_id, subTypeModel);
    subType.description = description;
    subType.thumb = thumb;
    await subTypeModel.updateOne(subType);
  }
  static async editSubTypeName(subtype_id, subTypeModel, name) {
    const subType = await this.findSubTypeById(subtype_id, subTypeModel);
    subType.type = name;
    await subTypeModel.updateOne(subType);
  }
  static async updateSubType(subTypeModel, subType) {
    return await subTypeModel.updateOne(subType);
  }
  static async updateSubTypeProducts(subTypeModel, subtype_id, subTypeProduct) {
    return await subTypeModel.findByIdAndUpdate(
      { _id: subtype_id },
      {
        $set: { products: subTypeProduct },
      },
      { isNew: true }
    );
  }
}
module.exports = SubTypeRepository;
