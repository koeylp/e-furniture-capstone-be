const { default: mongoose } = require("mongoose");
const {
  checkValidId,
  getUnSelectData,
  getSelectData,
  defaultVariation,
} = require("../../utils");
const InventoryRepository = require("./inventoryRepository");

class SubTypeRepository {
  static async createSubTypeValue(subTypeModel, payload) {
    const result = await subTypeModel.create({
      type: payload.subType,
      description: payload.description,
      thumb: payload.thumb,
      attributes: payload.attributes,
      group: payload.group,
    });
    if (!result) throw new InternalServerError("Cannot Add SubType Value!");
    return result;
  }
  static async getSubTypes(
    subTypeModel,
    option = ["_id", "type", "slug", "attributes", "products", "thumb", "group"]
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
    const option = ["products", "createdAt", "updatedAt"];
    const query = {
      is_draft: false,
      is_published: true,
    };
    return await subTypeModel
      .find(query)
      .populate({
        path: "attributes",
        model: "Attribute",
        select: "-createdAt -updatedAt -__v",
      })
      .populate({
        path: "group",
        model: "SubTypeGroup",
        match: { slug: { $exists: true } },
        select: "-createdAt -updatedAt -__v",
      })
      .select(getUnSelectData(option));
  }
  static async findSubTypeById(subtype_id, subTypeModel) {
    checkValidId(subtype_id);
    const query = {
      _id: new mongoose.Types.ObjectId(subtype_id),
      is_draft: false,
      is_published: true,
    };
    return await subTypeModel
      .findOne(query)
      .select(getUnSelectData(["products", "attributes"]));
  }
  static async findSubTypeBySlug(
    slug,
    subTypeModel,
    option = ["products", "updatedAt", "createdAt", "__v"]
  ) {
    const query = {
      slug: slug,
    };
    return await subTypeModel
      .findOne(query)
      .populate({
        path: "attributes",
        model: "Attribute",
        select: "-createdAt -updatedAt -__v",
      })
      .select(getUnSelectData(option));
  }
  static async findSubTypeBySlugWithPopulate(slug, subTypeModel) {
    const query = {
      slug: slug,
    };
    let result = await subTypeModel
      .findOne(query)
      .select(getUnSelectData(["createdAt", "updatedAt", "__v", "attributes"]))
      .populate({
        path: "products.productId",
        model: "Product",
        select:
          "-is_draft -is_published -createdAt -updatedAt -__v -attributes ",
      })
      .lean();
    // result.products = result.products.map((data) => {
    //   data.productId.select_variation = data.productId.variation.map((item) => {
    //     return defaultVariation(item);
    //   });
    //   return { ...data };
    // });
    // return result;

    result.products = await Promise.all(
      result.products.map(async (data) => {
        console.log(data);
        data.productId.variation = await InventoryRepository.getStockForProduct(
          data._id,
          data.productId.variation
        );
        data.productId.select_variation = data.productId.variation.map(
          (item) => {
            return defaultVariation(item);
          }
        );
        return { ...data };
      })
    );
    return result;
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
  static async publishSubType(subTypeModel, subType_id) {
    return await subTypeModel.findByIdAndUpdate(
      {
        _id: subType_id,
      },
      {
        $set: {
          is_draft: false,
          is_published: true,
        },
      }
    );
  }
  static async draftSubType(subTypeModel, subType_id) {
    return await subTypeModel.findByIdAndUpdate(
      {
        _id: subType_id,
      },
      {
        $set: {
          is_draft: true,
          is_published: false,
        },
      }
    );
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
  static async getDraftSubType(subTypeModel) {
    const query = {
      is_draft: true,
      is_published: false,
    };
    return await subTypeModel.find(query).lean();
  }
  static async getPublishSubType(subTypeModel) {
    const query = {
      is_draft: false,
      is_published: true,
    };
    return await subTypeModel.find(query).lean();
  }
  static async getAllSubType(subTypeModel) {
    const query = {};
    return await subTypeModel.find(query).lean();
  }
  static async removeSubType(subTypeModel, subTypeValue_id) {
    checkValidId(subTypeValue_id);
    const query = {
      _id: new mongoose.Types.ObjectId(subTypeValue_id),
    };
    return await subTypeModel.deleteOne(query);
  }
  static async pullProductId(subTypeModel, subType_slug, product_id) {
    checkValidId(product_id);
    const query = {
      slug: subType_slug,
    };
    const option = {
      $pull: {
        products: { productId: product_id },
      },
    };
    return await subTypeModel.findOneAndUpdate(query, option, { isNew: true });
  }
}
module.exports = SubTypeRepository;
