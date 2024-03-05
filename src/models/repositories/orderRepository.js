const _Order = require("../orderModel");
const { getUnSelectData, checkValidId } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
class OrderRepository {
  static async getOrders({ query = {}, page, limit }) {
    const skip = (page - 1) * limit;
    const orders = await _Order.find({ status: 1 });
    const result = await _Order
      .find(query)
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return { total: orders.length, data: result };
  }
  static async getOrdersByUser(account_id, page, limit) {
    checkValidId(account_id);
    const query = {
      account_id: account_id,
      status: 1,
    };
    return await this.getOrders(query, page, limit);
  }
  static async getOrdersByType(order_tracking, page, limit) {
    const query = {
      order_tracking: order_tracking,
      status: 1,
    };
    return await this.getOrders(query, page, limit);
  }
  static async findOrderById({ account_id = null, order_id }) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      account_id: account_id,
      status: 1,
    };
    return await _Order
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
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
    if (!newOrder) throw new InternalServerError();
    newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    return newOrder;
  }
  static async update(order_id, order_tracking) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.updateOne(query, {
      $set: { order_tracking: order_tracking, status: 0 },
    });
  }
  static async createOrderGuest(order) {
    const newOrder = await _Order.create({
      guest: true,
      order_checkout: order.order_checkout,
      order_products: order.order_products,
      payment: order.payment,
      order_shipping: order.order_shipping,
    });
    if (!order) throw new InternalServerError();
    newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    return newOrder;
  }
}
module.exports = OrderRepository;
