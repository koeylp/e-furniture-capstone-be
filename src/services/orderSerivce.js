const OrderRepository = require("../models/repositories/orderRepository");
const {
  verifyProductStockExistence,
  verifyOrderExistence,
  verifyOrderExistenceWithUser,
} = require("../utils/verifyExistence");
const { orderTrackingMap } = require("../config/orderTrackingConfig");
const { getKeyByValue } = require("../utils/keyValueUtil");
const { capitalizeFirstLetter } = require("../utils/format");
const { BadRequestError } = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
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
    return await OrderRepository.getOrdersByType(type, page, limit);
  }
  static async removeOrder(order_id) {
    return await OrderRepository.removeOrder(order_id);
  }
  static async createOrder(account_id, order) {
    await verifyProductStockExistence(order);
    const updatedVoucher = await VoucherRepository.save(order.order_checkout.voucher);
    if (!updatedVoucher)
      throw new ForbiddenError(
        `Voucher ${found_voucher._id} was applied failed`
      );
    return await OrderRepository.createOrder(account_id, order);
  }
  static async updateTracking(order_id) {
    const order = await verifyOrderExistence(order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(order.order_tracking)
    );
    if (key_of_type === 4) throw new BadRequestError("Order was done!");
    return await OrderRepository.update(
      order_id,
      orderTrackingMap.get(key_of_type + 1)
    );
  }
  static async createOrderGuest(order) {
    await verifyProductStockExistence(order);
    return await OrderRepository.createOrderGuest(order);
  }
  static async cancelOrder(account_id, order_id) {
    const foundOrder = await verifyOrderExistenceWithUser(account_id, order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(foundOrder.order_tracking)
    );
    if (key_of_type !== 1)
      throw new BadRequestError(
        "The order was confirmed, you cannot cancel the order!"
      );
    return await OrderRepository.update(order_id, orderTrackingMap.get(5));
  }
}
module.exports = OrderService;
