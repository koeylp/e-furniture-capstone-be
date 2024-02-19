const { orderBy } = require("lodash");
const OrderRepository = require("../models/repositories/orderRepository");
const { verifyProductStockExistence } = require("../utils/verifyExistence");
class OrderService {
  static async getOrders(page, limit) {
    return await OrderRepository.getOrders(page, limit);
  }
  static async findOrderDetail(order_id) {
    return await OrderRepository.findOrderById(order_id);
  }
  static async findOrderByUser(account_id, page, limit) {
    return await OrderRepository.getOrdersByUser(account_id, page, limit);
  }
  static async findOrderByType(type, page, limit) {
    return await OrderRepository.getOrdersByType(type, page, limit);
  }
  static async removeOrder(order_id) {
    return await OrderRepository.removeOrder(order_id);
  }
  static async createOrder(account_id, order) {
    // await verifyProductStockExistence(order);
    return await OrderRepository.createOrder(account_id, order);
  }
}
module.exports = OrderService;
