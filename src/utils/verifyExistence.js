const OrderRepository = require("../models/repositories/orderRepository");
const ProductRepository = require("../models/repositories/productRepository");
const { NotFoundError } = require("./errorHanlder");
const { checkProductStock } = require("./stockUtil");

class VerifyExistence {
  static async verifyProductExistence(product_id) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new NotFoundError(`Product with id ${product_id} not found`);
    return product;
  }

  static async verifyProductStockExistence(order) {
    const products = order.order_products;
    let result = false;
    for (const product of products) {
      result = await checkProductStock(product);
    }
    return result;
  }

  static async verifyOrderExistence(order_id) {
    const order = await OrderRepository.findOrderById({ order_id });
    if (!order) throw new NotFoundError(`Order with id: ${order_id} not found`);
    return order;
  }

  static async verifyOrderExistenceWithUser(account_id, order_id) {
    const order = await OrderRepository.findOrderById({ account_id, order_id });
    if (!order) throw new NotFoundError(`Order with id: ${order_id} not found`);
    return order;
  }
}

module.exports = VerifyExistence;
