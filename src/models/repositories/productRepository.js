const { _Product } = require("../productModel");
const {
  getSelectData,
  getUnSelectData,
  checkValidId,
} = require("../../utils/index");
const { BadRequestError } = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
class ProductRepository {
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
  static async updateIsDraft(product_id, options = { new: true }) {
    const product = await this.findProductById(product_id);
    if (!product) throw new BadRequestError();
    product.is_draft = true;
    product.is_published = false;
    return await _Product.update(product);
  }
  static async updateIsPublished(product_id, options) {
    const product = await this.findProductById(product_id);
    if (!product) throw new BadRequestError();
    product.is_draft = false;
    product.is_published = true;
    return await _Product.update(product);
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
  static async removeProduct(product_id) {
    const product = await this.findProductById(product_id);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Delete!");
    let query = {
      _id: new mongoose.Types.ObjectId(product_id),
    };
    return await _Product.deleteOne(query);
  }
  static async removeMany(query) {}
}
module.exports = ProductRepository;
