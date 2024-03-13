const RevenueRepository = require("../models/repositories/revenueRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const ProductRepository = require("../models/repositories/productRepository");
const InventoryRepository = require("../models/repositories/inventoryRepository");
class StatisticService {
  static async getStatisticValue() {
    const query = {
      stock: { $lte: 10 },
    };
    const products = await InventoryRepository.getInventory(query);
    const waiting_query = {};
    const orderWaiting = await OrderRepository.getOrders(waiting_query);
    const shipping_query = {};
    const shippingQuery = await OrderRepository.getOrders(shipping_query);
    return {
      waiting: orderWaiting.length,
      shipping: shippingQuery.length,
      product: products.length,
    };
  }
}
module.exports = StatisticService;
