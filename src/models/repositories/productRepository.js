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
    product.isDraft = false;
    product.isPublished = true;
    return await _Product.update(product);
  }
  static async updateIsPublished(query, options) {
    const product = await this.findProductById(query);
    if (!product) throw new BadRequestError();
    product.isDraft = true;
    product.isPublished = false;
    return await _Product.update(product);
  }
  static async getAlls(query) {
    return await _Product
      .find(query)
      .select(getUnSelectData(["__v", "isDraft", "isPublished"]))
      .lean();
  }
  static async getAllDraft() {
    const query = { isDraft: true, isPublished: false };
    return await this.getAlls(query);
  }
  static async getAllPublished() {
    const query = { isPublished: true, isDraft: false };
    return await this.getAlls(query);
  }
  static async removeMany(query) {}
}
module.exports = ProductRepository;
