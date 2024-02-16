const ProductRepository = require("../models/repositories/productRepository");
const { NotFoundError } = require("./errorHanlder");

class VerifyExistence {
  static async verifyProductExistence(product_id) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new NotFoundError(`Product with id: ${product_id} not found`);
    return product;
  }
}

module.exports = VerifyExistence;
