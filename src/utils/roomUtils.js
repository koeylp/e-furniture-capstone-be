const { BadRequestError } = require("./errorHanlder");
const ProductRepository = require("../models/repositories/productRepository");

class RoomUtils {
  static async checkProducts(products) {
    if (!Array.isArray(products)) throw new BadRequestError();
    let productQuantityMap = new Map();
    await Promise.all(
      products.map(async (product) => {
        await ProductRepository.findProductById(product.product);
        if (product.quantity <= 0) {
          throw new BadRequestError("Quantity must be greater than 0");
        }
        if (productQuantityMap.has(product.product)) {
          let currentQuantity = productQuantityMap.get(product.product);
          productQuantityMap.set(
            product.product,
            (currentQuantity += product.quantity)
          );
        } else {
          productQuantityMap.set(product.product, product.quantity);
        }
      })
    );
    const updatedProducts = Array.from(productQuantityMap.entries()).map(
      ([productId, quantity]) => ({
        product: productId,
        quantity,
      })
    );
    return updatedProducts;
  }
}
module.exports = RoomUtils;
