const ProductFactory = require("../services/productFactory/factory");
const ProductService = require("../services/productService");
const { OK } = require("../utils/successHandler");

class ProductController {
  static async createProduct(req, res) {
    const payload = req.body;
    const { type } = payload;
    return new OK({
      message: "Create Product Successfully!",
      metaData: await ProductFactory.createProduct(type, payload),
    }).send(res);
  }
  static async getDraftProduct(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Draft Product!",
      metaData: await ProductService.getAllDraft(page, limit, sortType),
    }).send(res);
  }
  static async getPublishedProduct(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductService.getAllPublished(page, limit, sortType),
    }).send(res);
  }
  static async getProductsByType(req, res) {
    const { type } = req.params;
    const { page, limit } = req.query;
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductFactory.getProductsByType(page, limit, type),
    }).send(res);
  }
  static async getProductsBySubType(req, res) {
    const { type, slug } = req.params;
    const { page, limit } = req.query;
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductFactory.getProductsBySubType(
        page,
        limit,
        type,
        slug
      ),
    }).send(res);
  }
  static async findProduct(req, res) {
    const { slug } = req.params;
    return new OK({
      message: "Product Detail!!",
      metaData: await ProductService.findProduct(slug),
    }).send(res);
  }
}
module.exports = ProductController;
