const _Order = require("../orderModel");
const {
  getSelectData,
  getUnSelectData,
  checkValidId,
} = require("../../utils/index");
const { default: mongoose } = require("mongoose");
const { BadRequestError } = require("../../utils/errorHanlder");
class OrderRepository {
  static async getOrders(query = {}, page, limit) {
    const skip = (page - 1) * limit;
    return await _Order
      .find(query)
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }
  static async getOrdersByUser(account_id, page, limit) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      status: 1,
    };
    return await getOrders(query, page, limit);
  }
  static async getOrdersByType(order_tracking, page, limit) {
    checkValidId(account_id);
    const query = {
      order_tracking: order_tracking,
      status: 1,
    };
    return await getOrders(query, page, limit);
  }
  static async findOrderById(order_id) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    const order = await _Order
      .find(query)
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    if (!order) throw new BadRequestError();
  }
  static async removeOrder(order_id) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.deleteOne(query);
  }
  static async createOrder(account_id, order) {
    const newOrder = await _Order.create({
      account_id: account_id,
      order_checkout: order.order_checkout,
      order_products: order.order_products,
      payment: order.payment,
      order_shipping: order.order_shipping,
    });
    if (!order) throw new InternalServerError();
    return newOrder;
  }
}
module.exports = OrderRepository;
