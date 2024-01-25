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
  static async check(req, res) {
    return new OK({
      message: "Create Product Successfully!",
      metaData: await ProductFactory.checkProductType(),
    }).send(res);
  }
}
module.exports = ProductController;
