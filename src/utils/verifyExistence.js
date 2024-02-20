const ProductRepository = require("../models/repositories/productRepository");
const { NotFoundError } = require("./errorHanlder");
const { checkProductStock, updateWarehouseStock } = require("./stockUtil");

class VerifyExistence {
  static async verifyProductExistence(product_id) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new NotFoundError(`Product with id: ${product_id} not found`);
    return product;
  }

  static async verifyProductStockExistence(order) {
    const products = order.order_products;
    for (const product of products) {
      await checkProductStock(product);
      await updateWarehouseStock(product);
    }
  }
}

module.exports = VerifyExistence;
