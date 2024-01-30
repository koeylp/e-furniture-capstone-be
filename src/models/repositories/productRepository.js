const _Product = require("../productModel");
const { getSelectData, getUnSelectData } = require("../../utils/index");
const { BadRequestError } = require("../../utils/errorHanlder");
class ProductRepository {
  static async findProductById(query, filter = []) {
    return await _Product
      .findOne(query)
      .select(getSelectData(filter))
      .populate("room")
      .lean()
      .exec();
  }
  static async updateIsDraft(query, options = { new: true }) {
    const product = await this.findProductById(query);
    if (!product) throw new BadRequestError();
    product.is_draft = false;
    product.is_published = true;
    return await _Product.update(product);
  }
  static async updateIsPublished(query, options) {
    const product = await this.findProductById(query);
    if (!product) throw new BadRequestError();
    product.is_draft = true;
    product.is_published = false;
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
  static async removeMany(query) {}
}
module.exports = ProductRepository;
