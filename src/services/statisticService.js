const RevenueRepository = require("../models/repositories/revenueRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const ProductRepository = require("../models/repositories/productRepository");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const AccountRepository = require("../models/repositories/accountRepository");

class StatisticService {
  static async getStatisticValue() {
    const products = await ProductRepository.getAllsWithoutPagination();
    const orders = await OrderRepository.getOrderWithoutPagination();

    const query = {
      role: { $lte: 31 },
    };
    const users = await AccountRepository.getAccountsWithoutPagination(query);
    return {
      products: products.total,
      orders: orders.total,
      users: users.total,
    };
  }
  static async getOrdersIn7days() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const query = [
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
          },
          count: { $sum: 1 },
        },
      },
    ];

    return await OrderRepository.Aggregate({ query });
    // return total;
  }
}
module.exports = StatisticService;
