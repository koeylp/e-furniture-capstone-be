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
  static async updateIsDraf(query, options = { new: true }) {
    const product = await this.findProductById(query);
    if (!product) throw new BadRequestError();
    product.isDraf = false;
    product.isPublished = true;
    return await _Product.update(product);
  }
  static async updateIsPublish(query, options) {
    const product = await this.findProductById(query);
    if (!product) throw new BadRequestError();
    product.isDraf = true;
    product.isPublished = false;
    return await _Product.update(product);
  }
  static async getAlls(query) {
    return await _Product
      .find(query)
      .select(getUnSelectData(["__v", "isDraf", "isPublished"]))
      .lean();
  }
  static async getAllDraf() {
    const query = { isDraf: true, isPublished: false };
    return await this.getAlls(query);
  }
  static async getAllPublished() {
    const query = { isPublished: true, isDraf: false };
    return await this.getAlls(query);
  }
  static async removeMany(query) {}
}
module.exports = ProductRepository;
