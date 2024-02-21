const { _Product } = require("../productModel");
const {
  getSelectData,
  getUnSelectData,
  checkValidId,
} = require("../../utils/index");
const { InternalServerError } = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
class ProductRepository {
  static async createProduct(payload) {
    const product = await _Product.create(payload);
    if (!product) throw new InternalServerError();
    return product;
  }
  static async findProductById(product_id, filter = []) {
    checkValidId(product_id);
    return await _Product
      .findOne({
        _id: new mongoose.Types.ObjectId(product_id),
      })
      .select(getSelectData(filter))
      .lean()
      .exec();
  }
  static async findProductBySlug(slug) {
    return await _Product
      .findOne({
        slug: slug,
      })
      .select(getUnSelectData(["__v", "createdAt", "updatedAt"]))
      .populate("room")
      .lean()
      .exec();
  }
  static async updateProduct(product) {
    return await _Product.updateOne(product);
  }
  static async publishProduct(product_id) {
    const product = await this.findProductById(product_id);
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
    return await _Product.updateOne(query, update, { new: true });
  }
  static async getAlls(query, page, limit, sortType) {
    const skip = (page - 1) * limit;
    return await _Product
      .find(query)
      .sort(sortType)
      .skip(skip)
      .limit(limit)
      .select(getUnSelectData(["__v", "isDraft", "isPublished"]))
      .lean();
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
  static async removeMany(query) {}
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
}
module.exports = ProductRepository;
