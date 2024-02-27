const _Order = require("../orderModel");
const { getUnSelectData, checkValidId } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
const { BadRequestError, NotFoundError } = require("../../utils/errorHanlder");
class OrderRepository {
  static async getOrders({ query = {}, page, limit }) {
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
  static async findOrderById(order_id) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
<<<<<<< HEAD
    if (!order) throw new NotFoundError();
=======
>>>>>>> 557339efce733c315fc4752af288e79912ffa9c9
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
  static async update(order_id, order_tracking) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.updateOne(query, {
      $set: { order_tracking: order_tracking },
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
    return newOrder;
  }
}
module.exports = OrderRepository;
