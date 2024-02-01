const ProductRepository = require("../models/repositories/productRepository");
const { BadRequestError } = require("../utils/errorHanlder");
const { returnSortType } = require("./productFactory/sortType");

class ProductService {
  static async getAllDraft(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllDraft(page, limit, sortType);
  }
  static async getAllPublished(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllPublished(page, limit, sortType);
  }
  static async findProduct(slug) {
    return await ProductRepository.findProductBySlug(slug);
  }
  static async deleteProduct(product_id) {
    return await ProductRepository.removeProduct(product_id);
  }
}
module.exports = ProductService;
