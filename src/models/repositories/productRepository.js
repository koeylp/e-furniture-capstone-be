const { _Product } = require("../productModel");
const {
  getSelectData,
  getUnSelectData,
  checkValidId,
  defaultVariation,
} = require("../../utils/index");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
const InventoryRepository = require("./inventoryRepository");

class ProductRepository {
  static async createProduct(payload) {
    const product = await _Product.create(payload);
    if (!product) throw new InternalServerError();
    return product;
  }
  static async checkProductById(product_id) {
    checkValidId(product_id);
    const product = await _Product
      .findOne({
        _id: new mongoose.Types.ObjectId(product_id),
        is_draft: false,
        is_published: true,
      })
      .lean()
      .exec();
    if (!product) throw new NotFoundError("Product Not Found!");
    return product;
  }
  static async findProductById(product_id, filter = []) {
    checkValidId(product_id);
    return await _Product
      .findOne({
        _id: new mongoose.Types.ObjectId(product_id),
        is_draft: false,
        is_published: true,
      })
      .select(getSelectData(filter))
      .lean()
      .exec();
  }
  static async findProductByIdWithoutState(product_id, filter = []) {
    checkValidId(product_id);
    return await _Product
      .findOne({
        _id: new mongoose.Types.ObjectId(product_id),
      })
      .select(getSelectData(filter))
      .lean()
      .exec();
  }
  static async findProductByName(name) {
    return await _Product
      .findOne({
        name: name,
      })
      .lean()
      .exec();
  }
  static async findProductBySlug(slug) {
    let result = await _Product
      .findOne({
        slug: slug,
      })
      .select(getUnSelectData(["__v", "createdAt", "updatedAt"]))
      .populate({
        path: "type",
        select: "name slug",
      })
      .lean()
      .exec();
    if (!result)
      throw new NotFoundError(`Cannot Find Any Product With Slug ${slug}`);
    // let { total, variation } = await InventoryRepository.getStockForProduct(
    //   result._id,
    //   result.variation
    // );
    // result.variation = variation;
    // result.stock = total;
    // result.select_variation = result.variation.map((item) => {
    //   return defaultVariation(item);
    // });
    // return result;
    return await this.handleStockAndDefaultVariation(result);
  }
  static async findProductByIDWithModify(product_id) {
    let result = await _Product
      .findOne({
        _id: product_id,
      })
      .select(getUnSelectData(["__v", "createdAt", "updatedAt"]))
      .populate({
        path: "type",
        select: "name slug",
      })
      .lean()
      .exec();
    if (!result) throw new NotFoundError(`Cannot Find Any Product With ID`);
    // let { total, variation } = await InventoryRepository.getStockForProduct(
    //   result._id,
    //   result.variation
    // );
    // result.variation = variation;
    // result.stock = total;
    // result.select_variation = result.variation.map((item) => {
    //   return defaultVariation(item);
    // });
    return await this.handleStockAndDefaultVariation(result);
  }
  static async findPublishProductByIDWithModify(product_id) {
    let result = await _Product
      .findOne({
        _id: product_id,
        is_draft: false,
        is_published: true,
      })
      .select(getUnSelectData(["__v", "createdAt", "updatedAt"]))
      .populate({
        path: "type",
        select: "name slug",
      })
      .lean()
      .exec();
    if (!result) return result;
    return await this.handleStockAndDefaultVariation(result);
  }
  static async updateProduct(query, update) {
    return await _Product.updateOne(query, update, { new: true });
  }
  static async publishProduct(product_id) {
    await this.findProductById(product_id);
    return await _Product.findByIdAndUpdate(
      { _id: product_id },
      {
        $set: {
          is_draft: false,
          is_published: true,
        },
      }
    );
  }
  static async draftProduct(product_id) {
    return await _Product.findOneAndUpdate(
      { _id: product_id },
      {
        $set: {
          is_draft: true,
          is_published: false,
        },
      }
    );
  }
  static async updateProductBySlug(product_slug, update) {
    const query = {
      slug: product_slug,
    };
    return await this.updateProduct(query, update);
  }
  static async updateProductById(product_id, update) {
    checkValidId(product_id);
    const query = {
      _id: new mongoose.Types.ObjectId(product_id),
    };
    return await this.updateProduct(query, update);
  }
  static async getAllsWithoutPagination(query = {}) {
    let result = await _Product.find(query);
    return { total: result.length, data: result };
  }
  static async getAllsWithoutPopulateAndStock(query) {
    return await _Product
      .find(query)
      .select(
        getUnSelectData([
          "__v",
          "isDraft",
          "isPublished",
          "attributes",
          "model3D",
        ])
      )
      .lean();
  }
  static async getAlls(query, page, limit, sortType) {
    const skip = (page - 1) * limit;
    const products = await _Product.find(query);
    let result = await _Product
      .find(query)
      .sort(sortType)
      .skip(skip)
      .limit(limit)
      .populate("type")
      .select(getUnSelectData(["__v", "isDraft", "isPublished"]))
      .lean();
    result = await Promise.all(
      result.map(async (data) => {
        // let { total, variation } = await InventoryRepository.getStockForProduct(
        //   data._id,
        //   data.variation
        // );
        // data.variation = variation;
        // data.stock = total;
        // data.select_variation = data.variation.map((item) => {
        //   return defaultVariation(item);
        // });
        return await this.handleStockAndDefaultVariation(data);
      })
    );
    return { total: products.length, data: result };
  }

  static async handleStockAndDefaultVariation(result) {
    let { total, variation } = await InventoryRepository.getStockForProduct(
      result._id,
      result.variation
    );
    result.variation = variation;
    result.stock = total;
    result.select_variation = result.variation.map((item) => {
      return defaultVariation(item);
    });
    return result;
  }

  static async getAllDraft(page, limit, sortType) {
    const query = { is_draft: true, is_published: false };
    return await this.getAlls(query, page, limit, sortType);
  }
  static async getAllPublished(page, limit, sortType) {
    const query = { is_published: true, is_draft: false };
    return await this.getAlls(query, page, limit, sortType);
  }
  static async getProductByType(page, limit, sortType, type_id) {
    checkValidId(type_id);
    const query = {
      is_published: true,
      is_draft: false,
      type: new mongoose.Types.ObjectId(type_id),
    };
    return await this.getAlls(query, page, limit, sortType);
  }
  static async getProductByRoom(page, limit, sortType, room_id) {
    checkValidId(room_id);
    const query = {
      is_published: true,
      is_draft: false,
      room: room_id,
    };
    return await this.getAlls(query, page, limit, sortType);
  }
  static async removeProduct(product_id) {
    let query = {
      _id: new mongoose.Types.ObjectId(product_id),
    };
    return await _Product.deleteOne(query);
  }
  static async removeProductBySlug(product_slug) {
    let query = {
      slug: product_slug,
    };
    return await _Product.deleteOne(query);
  }
  static async draftRangeProductByType(type_id) {
    const query = {
      type: type_id,
      is_published: true,
    };
    const update = {
      is_draft: true,
      is_published: false,
    };
    return await _Product.updateMany(query, update);
  }
  static async publishRangeProductByType(query) {
    const update = {
      is_draft: false,
      is_published: true,
    };
    return await _Product.updateMany(query, update);
  }
  static async removeRangeProductByType(type_id) {
    const query = {
      type: type_id,
    };
    return await _Product.deleteMany(query);
  }
  static async draftRangeProductBySubType(subtype_slug) {
    const query = {
      "attributes.type": [subtype_slug],
      is_published: true,
    };
    const update = {
      is_draft: true,
      is_published: false,
    };
    return await _Product.updateMany(query, update);
  }
  static async removeRangeProductBySubType(subtype_slug) {
    const query = {
      "attributes.type": [subtype_slug],
    };
    return await _Product.deleteMany(query);
  }
  static async updateRangeProduct(productIdsToUpdate, update) {
    return await _Product.updateMany(
      { _id: { $in: productIdsToUpdate } },
      update,
      {
        new: true,
      }
    );
  }
  static async searchByText({
    keySearch,
    filter = [],
    options = {},
    page,
    limit,
  }) {
    let searchValue =
      typeof keySearch === "object" ? keySearch.text : keySearch;
    searchValue = searchValue.trim();
    const query = {
      name: { $regex: searchValue, $options: "i" },
      is_draft: false,
      is_published: true,
    };
    const result = await this.getAlls(query, page, limit, {});
    return result;
  }
  static async findVariationValues(product_id, variation) {
    const product = await this.findProductById(product_id);
    if (!product) return;
    const matchingVariations = product.variation.filter((item) =>
      variation.some((inside) => inside.variation_id === item._id.toString())
    );

    const result = matchingVariations.flatMap((item) =>
      item.properties
        .filter((data) =>
          variation.some((inside) => inside.property_id === data._id.toString())
        )
        .map((data) => ({
          property_id: variation.find(
            (inside) => inside.property_id === data._id.toString()
          ).property_id,
          variation_id: item._id,
          color: data.value,
          sub_price: data.sub_price,
        }))
    );

    return result;
  }
}
module.exports = ProductRepository;
