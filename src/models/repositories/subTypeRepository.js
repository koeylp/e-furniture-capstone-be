const { default: mongoose } = require("mongoose");
const { checkValidId, getUnSelectData, getSelectData } = require("../../utils");

class SubTypeRepository {
  static async getSubTypes(subTypeModel, option = ["_id", "type", "slug"]) {
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
  static async findSubTypeBySlug(slug, subTypeModel) {
    const query = {
      slug: slug,
    };
    return await subTypeModel
      .findOne(query)
      .select(
        getUnSelectData([
          "products",
          "attributes",
          "updatedAt",
          "createdAt",
          "__v",
        ])
      );
  }
  static async findSubTypeByName(name, subTypeModel) {
    const query = {
      type: name,
    };
    return await subTypeModel.findOne(query);
  }
  static async addProductSubType(product_id, subTypeModel, type) {
    checkValidId(product_id);
    const query = {
      type,
    };
    const update = {
      $push: {
        products: new mongoose.Types.ObjectId(product_id),
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
}
module.exports = SubTypeRepository;
