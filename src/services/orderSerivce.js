const OrderRepository = require("../models/repositories/orderRepository");
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
}
module.exports = OrderService;
