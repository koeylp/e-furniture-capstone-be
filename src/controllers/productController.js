const ProductFactory = require("../services/productFactory/factory");
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
      metaData: await ProductFactory.getAllDraft(page, limit, sortType),
    }).send(res);
  }
  static async getPublishedProduct(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductFactory.getAllPublished(page, limit, sortType),
    }).send(res);
  }
}
module.exports = ProductController;
