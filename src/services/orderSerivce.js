const OrderRepository = require("../models/repositories/orderRepository");
const {
  verifyProductStockExistence,
  verifyOrderExistence,
  verifyOrderExistenceWithUser,
} = require("../utils/verifyExistence");
const { orderTrackingMap } = require("../config/orderTrackingConfig");
const { getKeyByValue } = require("../utils/keyValueUtil");
const { capitalizeFirstLetter } = require("../utils/format");
const {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
const RevenueRepository = require("../models/repositories/revenueRepository");
const CartUtils = require("../utils/cartUtils");
const StockUtil = require("../utils/stockUtil");
const TransactionRepository = require("../models/repositories/transactionRepository");
const Mailtrap = require("../utils/mailtrap");
class OrderService {
  static async getOrders(page, limit) {
    return await OrderRepository.getOrders({ page, limit });
  }
  static async findOrderDetail(order_id) {
    return await OrderRepository.findOrderById({ order_id });
  }
  static async findOrderByUser(account_id, page, limit) {
    return await OrderRepository.getOrdersByUser(account_id, page, limit);
  }
  static async findOrderByType(type, page, limit) {
    if (type === "All") return await OrderRepository.getOrders({ page, limit });
    return await OrderRepository.getOrdersByType({ type, page, limit });
  }
  static async findOrderByTypeU(account_id, type, page, limit) {
    if (type === "All") {
      const query = {
        account_id: account_id,
        guest: false,
      };
      return await OrderRepository.getOrders({ query, page, limit });
    }
    return await OrderRepository.getOrdersByType({
      account_id,
      type,
      page,
      limit,
    });
  }
  static async removeOrder(order_id) {
    return await OrderRepository.removeOrder(order_id);
  }
  static async createOrder(account_id, order) {
    await verifyProductStockExistence(order);
    if (order.order_checkout.voucher) {
      const updatedVoucher = await VoucherRepository.save(
        order.order_checkout.voucher
      );
      if (!updatedVoucher)
        throw new ForbiddenError(
          `Voucher ${found_voucher._id} was applied failed`
        );
    }
    const products = order.order_products;
    for (let product of products) {
      await CartUtils.removeItem(account_id, product);
    }
    const newOrder = await OrderRepository.createOrder(account_id, order);
    if (newOrder) {
      const day = new Date().setUTCHours(0, 0, 0, 0);
      const profit = order.order_checkout.final_total;
      await RevenueRepository.updateOrInsert(profit, day);
      await StockUtil.updateStock(order);
    }
    return newOrder;
  }
  static async updateTracking(order_id, note) {
    const order = await verifyOrderExistence(order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        order.order_tracking[order.order_tracking.length - 1].name
      )
    );
    if (key_of_type === 4) throw new BadRequestError("Order was done!");
    return await OrderRepository.update(
      order_id,
      orderTrackingMap.get(key_of_type + 1),
      note
    );
  }
  static async createOrderGuest(order) {
    await verifyProductStockExistence(order);
    await Mailtrap.send();
    return await OrderRepository.createOrderGuest(order);
  }
  static async cancelOrder(account_id, order_id) {
    const foundOrder = await verifyOrderExistenceWithUser(account_id, order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        foundOrder.order_tracking[foundOrder.order_tracking.length - 1].name
      )
    );
    if (key_of_type !== 0)
      throw new BadRequestError(
        "The order was confirmed, you cannot cancel the order!"
      );
    return await OrderRepository.update(order_id, orderTrackingMap.get(4), "");
  }
  static async paid(account_id, transaction) {
    const order_id = transaction.order_id;
    const foundOrder = await OrderRepository.findOrderById({
      account_id,
      order_id,
    });
    if (!foundOrder) throw new NotFoundError("Order not found for this user");
    transaction.account_id = account_id;
    const transactionCreation = await TransactionRepository.create(transaction);
    if (!transactionCreation)
      throw new InternalServerError("Saving transaction failed!");
    const updatedOrder = await OrderRepository.paid(account_id, order_id);
    return updatedOrder;
  }
}
module.exports = OrderService;
